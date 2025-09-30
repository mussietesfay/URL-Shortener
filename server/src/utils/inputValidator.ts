
export const isVlidateLongUrl = (longUrl: string):boolean =>{
  return !!(longUrl && longUrl.trim() !== '');
}