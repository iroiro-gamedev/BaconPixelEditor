/**
 * GIF89a Encoder
 * Supports animated GIFs with per-frame delay and transparency.
 */
class GIFEncoder {
  /**
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.frames = [];
    this.repeat = 0; // 0 = loop forever, -1 = no loop, N = N times
  }

  setRepeat(n) { this.repeat = n; }

  /**
   * Add a frame.
   * @param {number[]} pixels  - flat array of palette indices (0..N); transparent=-1
   * @param {string[]} palette - array of '#RRGGBBAA' or '#RRGGBB' hex strings
   * @param {number}   delay   - frame delay in milliseconds
   */
  addFrame(pixels, palette, delay = 100) {
    this.frames.push({ pixels: Array.from(pixels), palette, delay });
  }

  /** Encode all frames and return Uint8Array of GIF data. */
  encode() {
    if (this.frames.length === 0) throw new Error('No frames');

    // Build a unified palette (use first frame's palette as global)
    const rawPalette = this.frames[0].palette;
    const hasTransparency = this.frames.some(f => f.pixels.some(p => p < 0));

    // Build RGB color table
    const colorTable = rawPalette.map(h => this._hexToRGB(h));
    let transparentIndex = -1;

    if (hasTransparency) {
      transparentIndex = colorTable.length;
      colorTable.push([0, 0, 0]); // placeholder for transparent
    }

    // Pad to power-of-2 length, minimum 2
    let tableSize = 2;
    while (tableSize < colorTable.length) tableSize <<= 1;
    while (colorTable.length < tableSize) colorTable.push([0, 0, 0]);

    const colorBits = Math.max(2, Math.round(Math.log2(tableSize)));
    const colorTableBytes = colorTable.flatMap(([r, g, b]) => [r, g, b]);

    const out = new ByteWriter();

    // --- GIF89a header ---
    out.writeStr('GIF89a');

    // Logical Screen Descriptor
    out.writeU16(this.width);
    out.writeU16(this.height);
    out.writeByte(0x80 | (colorBits - 1)); // Global CT flag + size
    out.writeByte(0);  // BG color index
    out.writeByte(0);  // Pixel aspect ratio

    // Global Color Table
    out.writeBytes(colorTableBytes);

    // Netscape Application Extension (loop control)
    if (this.repeat >= 0) {
      out.writeByte(0x21); out.writeByte(0xFF); out.writeByte(0x0B);
      out.writeStr('NETSCAPE2.0');
      out.writeByte(0x03); out.writeByte(0x01);
      out.writeU16(this.repeat);
      out.writeByte(0x00);
    }

    // --- Frames ---
    for (const frame of this.frames) {
      const delayCentisec = Math.max(1, Math.round(frame.delay / 10));

      // Map -1 (transparent) to transparentIndex
      const indexed = frame.pixels.map(p => (p < 0 ? transparentIndex : p));

      // Graphic Control Extension
      out.writeByte(0x21); out.writeByte(0xF9); out.writeByte(0x04);
      let gcFlags = (2 << 2); // disposal: restore to background
      if (hasTransparency) gcFlags |= 0x01;
      out.writeByte(gcFlags);
      out.writeU16(delayCentisec);
      out.writeByte(hasTransparency ? transparentIndex : 0);
      out.writeByte(0x00); // block terminator

      // Image Descriptor (no local color table)
      out.writeByte(0x2C);
      out.writeU16(0); out.writeU16(0);
      out.writeU16(this.width); out.writeU16(this.height);
      out.writeByte(0x00); // no local CT, no interlace

      // Image Data (LZW)
      const minCodeSize = colorBits;
      out.writeByte(minCodeSize);

      const compressed = this._lzwCompress(indexed, minCodeSize);

      // Write in sub-blocks (max 255 bytes)
      for (let i = 0; i < compressed.length; i += 255) {
        const block = compressed.slice(i, i + 255);
        out.writeByte(block.length);
        out.writeBytes(block);
      }
      out.writeByte(0x00); // block terminator
    }

    // --- Trailer ---
    out.writeByte(0x3B);

    return out.toUint8Array();
  }

  // ---- Private helpers ----

  _hexToRGB(hex) {
    const s = hex.replace('#', '').slice(0, 6).padEnd(6, '0');
    return [
      parseInt(s.slice(0, 2), 16) || 0,
      parseInt(s.slice(2, 4), 16) || 0,
      parseInt(s.slice(4, 6), 16) || 0,
    ];
  }

  /**
   * LZW compress pixel indices.
   * Follows GIF89a spec: little-endian bit packing.
   * @param {number[]} pixels       - pixel values (0..clearCode-1)
   * @param {number}   minCodeSize  - minimum code size (2..8)
   * @returns {number[]} byte array
   */
  _lzwCompress(pixels, minCodeSize) {
    const clearCode = 1 << minCodeSize;
    const eofCode   = clearCode + 1;

    const bits = []; // output bits, LSB first within each byte

    let codeSize  = minCodeSize + 1;
    let nextCode  = eofCode + 1;
    const table   = new Map(); // key = prevCode * clearCode + pixel

    const writeBits = (code) => {
      for (let i = 0; i < codeSize; i++) bits.push((code >>> i) & 1);
    };

    const reset = () => {
      table.clear();
      nextCode = eofCode + 1;
      codeSize = minCodeSize + 1;
    };

    // Initial clear code
    writeBits(clearCode);

    if (pixels.length === 0) {
      writeBits(eofCode);
      return bitsToBytes(bits);
    }

    let prev = pixels[0]; // current "buffer" represented as a single code

    for (let i = 1; i < pixels.length; i++) {
      const k = pixels[i];
      const key = prev * clearCode + k;

      if (table.has(key)) {
        prev = table.get(key);
      } else {
        writeBits(prev);

        if (nextCode <= 4095) {
          table.set(key, nextCode++);
          // Expand code size when needed
          if (nextCode >= (1 << codeSize) && codeSize < 12) codeSize++;
        } else {
          // Table full — emit clear and reset
          writeBits(clearCode);
          reset();
        }

        prev = k;
      }
    }

    writeBits(prev);
    writeBits(eofCode);

    return bitsToBytes(bits);
  }
}

// ---- Bit packing utility ----
function bitsToBytes(bits) {
  const bytes = [];
  for (let i = 0; i < bits.length; i += 8) {
    let b = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) {
      b |= bits[i + j] << j;
    }
    bytes.push(b);
  }
  return bytes;
}

// ---- Byte writer utility ----
class ByteWriter {
  constructor() { this._data = []; }

  writeByte(b)    { this._data.push(b & 0xFF); }
  writeU16(n)     { this._data.push(n & 0xFF, (n >> 8) & 0xFF); }
  writeBytes(arr) { for (const b of arr) this._data.push(b & 0xFF); }
  writeStr(s)     { for (const c of s) this._data.push(c.charCodeAt(0)); }
  toUint8Array()  { return new Uint8Array(this._data); }
}

export default GIFEncoder;
