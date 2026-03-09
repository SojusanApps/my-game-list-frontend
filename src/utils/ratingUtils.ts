export function getRatingColor(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) return "transparent";
  if (rating < 5) return "rgba(252,165,165,0.9)";
  if (rating < 8) return "rgba(253,224,71,0.9)";
  return "rgba(110,231,183,0.9)";
}
