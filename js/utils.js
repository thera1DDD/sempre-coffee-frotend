export const $ = (s)=> document.querySelector(s);
export const safe = (v)=> String(v ?? "");
export const fmt = (n)=> `${Math.round(Number(n)||0)} руб`;

export function qp(key){
  return new URL(location.href).searchParams.get(key);
}

export function pluralPos(n){
  const r10 = n % 10, r100 = n % 100;
  if (r100 >= 11 && r100 <= 19) return "позиций";
  if (r10 === 1) return "позиция";
  if (r10 >= 2 && r10 <= 4) return "позиции";
  return "позиций";
}

export function statsForDishes(dishes){
  if(!dishes.length) return { count:0, min:0, max:0 };
  const prices = dishes.map(d=>Number(d.price)||0).filter(Boolean);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { count: dishes.length, min, max };
}
