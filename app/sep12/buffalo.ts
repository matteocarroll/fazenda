export type Leg = {
  src: string
  x: number
  y: number
  w: number
  h: number
  px: number
  py: number
}

export type Buffalo = {
  w: number
  h: number
  body: string
  legs: Leg[]
}

export const BUFFALO: Record<string, Buffalo> = {
  lead: {
    w: 801,
    h: 436,
    body: "/buffalo/lead-body.png",
    legs: [
      { src: "/buffalo/lead-leg0.png", x: 11,  y: 284, w: 100, h: 136, px: 67, py: 18 },
      { src: "/buffalo/lead-leg1.png", x: 138, y: 284, w: 119, h: 151, px: 38, py: 18 },
      { src: "/buffalo/lead-leg2.png", x: 397, y: 284, w: 75,  h: 147, px: 32, py: 18 },
      { src: "/buffalo/lead-leg3.png", x: 509, y: 284, w: 68,  h: 138, px: 31, py: 18 },
    ],
  },
  rear: {
    w: 836,
    h: 436,
    body: "/buffalo/rear-body.png",
    legs: [
      { src: "/buffalo/rear-leg0.png", x: 27,  y: 284, w: 88,  h: 152, px: 59, py: 18 },
      { src: "/buffalo/rear-leg1.png", x: 170, y: 284, w: 105, h: 139, px: 26, py: 18 },
      { src: "/buffalo/rear-leg2.png", x: 390, y: 284, w: 78,  h: 150, px: 52, py: 18 },
      { src: "/buffalo/rear-leg3.png", x: 582, y: 284, w: 108, h: 136, px: 27, py: 18 },
    ],
  },
  baby: {
    w: 716,
    h: 436,
    body: "/buffalo/baby-body.png",
    legs: [
      { src: "/buffalo/baby-leg0.png", x: 58,  y: 276, w: 64,  h: 121, px: 43, py: 18 },
      { src: "/buffalo/baby-leg1.png", x: 160, y: 276, w: 58,  h: 108, px: 29, py: 18 },
      { src: "/buffalo/baby-leg2.png", x: 245, y: 276, w: 140, h: 130, px: 104, py: 18 },
      { src: "/buffalo/baby-leg3.png", x: 420, y: 276, w: 75,  h: 160, px: 24, py: 18 },
    ],
  },
}

// Diagonal gait: front-left pairs with hind-right.
export const GAIT = [0, 0.5, 0.5, 0]
