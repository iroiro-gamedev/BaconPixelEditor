// Bacon Pixel Editor — Color utilities
export function parseHex(hex) {
  const s = (hex || '#00000000').replace('#', '');
  return {
    r: parseInt(s.slice(0,2),16)||0, g: parseInt(s.slice(2,4),16)||0,
    b: parseInt(s.slice(4,6),16)||0, a: s.length>=8?(parseInt(s.slice(6,8),16)||0):255,
  };
}
export function toHex8(r,g,b,a=255) {
  return '#'+[r,g,b,a].map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
}
export function hex8to6(h) { return (h||'#000000').slice(0,7); }
export function hslToRgb(h,s,l) {
  let r,g,b;
  if(s===0){r=g=b=l;}
  else{
    const q=l<0.5?l*(1+s):l+s-l*s,p=2*l-q;
    const hue2=(pp,qq,t)=>{if(t<0)t+=1;if(t>1)t-=1;if(t<1/6)return pp+(qq-pp)*6*t;if(t<1/2)return qq;if(t<2/3)return pp+(qq-pp)*(2/3-t)*6;return pp;};
    r=hue2(p,q,h+1/3);g=hue2(p,q,h);b=hue2(p,q,h-1/3);
  }
  return[Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

export function buildDefaultPalette() {
  const p=['#00000000'];
  for(let i=0;i<=8;i++){const v=Math.round(255-i*255/8);p.push(toHex8(v,v,v,255));}
  const hues=[0,22,45,75,110,150,175,200,225,255,280,315];
  const sats=[0.90,0.85,0.82,0.78,0.75,0.72,0.68,0.65];
  const lights=[0.92,0.80,0.66,0.52,0.39,0.27,0.17,0.09];
  for(const hd of hues){
    for(let si=0;si<lights.length;si++){
      const[r,g,b]=hslToRgb(hd/360,sats[si],lights[si]);
      p.push(toHex8(r,g,b,255));
    }
  }
  return p;
}
export const DEFAULT_PALETTE = buildDefaultPalette();
