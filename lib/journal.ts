/**
 * Journal posts. Each one is written to be useful on its own — these are not
 * linked from the homepage, and reach readers through search and shared links.
 *
 * `published` is an ISO date and feeds the BlogPosting markup, so only change
 * it when a post is genuinely new. Use `updated` when revising an old one.
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "ul"; items: string[] }

export type Post = {
  slug: string
  title: string
  summary: string
  published: string
  updated?: string
  body: Block[]
}

export const POSTS: Post[] = [
  {
    slug: "how-to-buy-a-suede-jacket",
    title: "How to Buy a Suede Jacket",
    summary:
      "What separates a suede jacket worth keeping from one you regret — the hide, the weight, the fit through the shoulder, and how to look after it once it is yours.",
    published: "2026-10-11",
    body: [
      {
        t: "p",
        text: "Suede is the most forgiving outerwear material to wear and the least forgiving to buy badly. A good one softens around you for decades. A poor one goes shiny at the cuffs within a season and never recovers. The difference is visible before you buy, if you know where to look.",
      },
      { t: "h2", text: "Start with the hide" },
      {
        t: "p",
        text: "Suede is leather finished on the inner split rather than the grain side, so the nap you are touching is the structure of the skin itself. Lambskin is the softest and the most delicate. Goat is springier and holds its shape. Sheep suede sits in between, and is what most of the jackets we carry are cut from. Press your thumb into the panel and release it: a good hide springs back without holding the mark, and the nap shifts colour as it moves, then settles.",
      },
      {
        t: "p",
        text: "Be suspicious of a hide that feels uniformly smooth, like brushed fabric. Heavy sanding and pigment coating can make cheap skin feel plush on the rail, but the finish sits on top rather than in the leather, and it is the first thing to wear off at the elbows and cuffs.",
      },
      { t: "h2", text: "Weight tells you what the jacket is for" },
      {
        t: "p",
        text: "A light suede blouson is a shirt-jacket: something to put over a tee in September. A heavier aviator or trucker is real outerwear and will carry a knit underneath. Neither is better, but buying one expecting the other is the most common mistake. Pick the jacket up off the rail before you try it. The weight in your hand is a more honest signal than the photograph.",
      },
      { t: "h2", text: "Fit: shoulder first, everything else second" },
      {
        t: "p",
        text: "The shoulder seam is the one thing a tailor cannot fix cheaply. It should sit at the edge of your shoulder, not down your arm. Everything after that is negotiable:",
      },
      {
        t: "ul",
        items: [
          "Sleeves can be shortened from the cuff, though on a zip cuff that is more work than it sounds.",
          "The body can be taken in at the side seams on most styles.",
          "Length is best left alone — the hem detailing is usually part of the design.",
          "Raise your arms. Suede has little stretch, so if it binds across the back in the shop, it will bind forever.",
        ],
      },
      { t: "h2", text: "Living with it" },
      {
        t: "p",
        text: "Suede wants less intervention than people expect. Brush it with a soft suede brush when the nap flattens, always in one direction. Let rain dry at room temperature, away from radiators, then brush it again once dry — water alone rarely ruins suede, but heat does. Hang it on a broad wooden hanger so the shoulders keep their shape.",
      },
      {
        t: "p",
        text: "Do not waterproof a new jacket on principle. Most sprays dull the nap slightly and flatten the colour, and a good hide handles light rain on its own. If you are going to treat it, test on the inside of a hem first.",
      },
      {
        t: "p",
        text: "Oil and grease are the real enemies, not water, and they are close to permanent. Take a stained jacket to a specialist leather cleaner rather than a general dry cleaner, and go sooner rather than later.",
      },
      { t: "h2", text: "What we stock" },
      {
        t: "p",
        text: "We carry suede outerwear from Valstar, the Milanese house best known for the Valstarino blouson, in sheep suede shirts, overshirts and zip jackets. Cale makes a glove-leather jacket cut closer to a shirt than a coat. Both are on the rail at Mott Street, and both are in the virtual store if you would rather look first.",
      },
    ],
  },
  {
    slug: "caring-for-fine-knitwear",
    title: "Caring for Fine Knitwear",
    summary:
      "Yak, cashmere, mohair and alpaca all behave differently. How to wash them, how to dry them, and why you should almost never hang a knit.",
    published: "2026-10-11",
    body: [
      {
        t: "p",
        text: "Most knitwear is not worn out. It is laundered out, stretched out, or eaten. All three are avoidable, and none of the fixes take much effort.",
      },
      { t: "h2", text: "Wash less than you think" },
      {
        t: "p",
        text: "Wool and its relatives are naturally odour-resistant and do not need washing after every wear. Three or four wears between washes is normal for a sweater worn over a shirt; more if it is only over a tee occasionally. Airing a knit overnight does most of what a wash would do, without the wear.",
      },
      { t: "h2", text: "When you do wash it" },
      {
        t: "p",
        text: "Hand washing is less trouble than it sounds and is gentler than any machine cycle:",
      },
      {
        t: "ul",
        items: [
          "Cool water — not warm. Heat plus agitation is what felts wool.",
          "A capful of wool-specific detergent. Regular detergent contains enzymes that attack protein fibres, which is exactly what wool is.",
          "Submerge, press gently, leave for ten minutes. Do not wring, twist or rub.",
          "Rinse in water of the same temperature. A sudden change in temperature shocks the fibre.",
          "Press the water out against the side of the basin, then roll the knit in a towel and press again.",
        ],
      },
      {
        t: "p",
        text: "If your machine has a true wool cycle with a low spin, it is a reasonable substitute — put the knit in a mesh bag first. The cycles labelled delicate are not the same thing.",
      },
      { t: "h2", text: "Drying: flat, always" },
      {
        t: "p",
        text: "Lay the knit flat on a dry towel, push it gently back into its original shape, and leave it away from sun and radiators. Hanging a wet knit is the single fastest way to ruin one — the weight of the water pulls the shoulders and lengthens the body permanently. For the same reason, store knitwear folded rather than hung.",
      },
      { t: "h2", text: "The fibres behave differently" },
      {
        t: "p",
        text: "Cashmere is fine and short-stapled, so it is the most prone to pilling early on. This is normal and settles down. Take the pills off with a cashmere comb or a sweater stone rather than pulling them, which drags the fibre out of the knit.",
      },
      {
        t: "p",
        text: "Yak is warmer than it looks and less prone to pilling than cashmere, with a drier hand. Mohair sheds in its first few wears — that is the nature of the fibre and not a fault. Alpaca has little memory, so it drapes beautifully but stretches if you hang it; be especially strict about folding.",
      },
      { t: "h2", text: "Moths" },
      {
        t: "p",
        text: "Moths lay eggs in dirty wool, not clean wool, so the most effective thing you can do is wash knitwear before putting it away for the season. Store it folded in a sealed box or bag with cedar or lavender, and check the back of the wardrobe occasionally — holes appear where the air does not move.",
      },
      { t: "h2", text: "What we stock" },
      {
        t: "p",
        text: "Our knitwear runs from Kota Gushiken's bleach-dyed cables and mohair blends to Blue Blue Japan's yak and cashmere crews and haori cardigans, with Cale's baby alpaca polo and air-wool pieces in between. If you are unsure how something should be handled, message us — it is a faster answer than a care label.",
      },
    ],
  },
  {
    slug: "trousers-and-how-they-should-fit",
    title: "Trousers, and How They Should Fit",
    summary:
      "Rise, break and taper explained without jargon, plus which alterations are worth paying for and which are not.",
    published: "2026-10-11",
    body: [
      {
        t: "p",
        text: "Trousers are the hardest thing to buy online and the easiest thing to get right in person, because almost everything that matters is visible in a mirror within ten seconds. Three measurements do most of the work.",
      },
      { t: "h2", text: "Rise" },
      {
        t: "p",
        text: "The rise is the distance from the crotch seam to the top of the waistband, and it decides where the trouser sits on your body. A low rise sits on the hips. A high rise sits at or near the natural waist, roughly at your navel. Nothing is inherently more correct, but the rise determines what the trouser can be worn with: a high rise wants a tucked shirt or a short knit, because the waistband is meant to be seen or covered deliberately. A low rise under a long overshirt reads as sloppy for reasons most people cannot name.",
      },
      {
        t: "p",
        text: "If a pair feels oddly short in the body or keeps sliding down, the rise is usually the problem rather than the waist size.",
      },
      { t: "h2", text: "Break" },
      {
        t: "p",
        text: "Break is the fold the fabric makes where the hem meets the shoe. Full break puts a clear horizontal crease across the front; no break leaves the hem just touching or sitting above the shoe. Most of what reads as modern sits between the two — a slight break, where the fabric kisses the shoe and dents rather than folds.",
      },
      {
        t: "p",
        text: "Wider and heavier trousers carry more break comfortably. A narrow trouser with a full break looks like it is collapsing. Decide the break with the shoes you will actually wear, not the ones you have on in the shop.",
      },
      { t: "h2", text: "Taper" },
      {
        t: "p",
        text: "Taper is how much the leg narrows from thigh to hem. It is the easiest thing to alter and the thing people most often alter too aggressively. A straight leg in a fabric with weight — flannel, cotton gabardine, corduroy — hangs cleanly without any taper at all, and taking it in usually makes it look cheaper rather than sharper.",
      },
      { t: "h2", text: "What to pay a tailor for" },
      {
        t: "ul",
        items: [
          "Hemming, always. It costs very little and changes more than anything else.",
          "Taking in the waist, if it gapes at the back while fitting through the seat.",
          "A modest taper below the knee, if the leg is genuinely wide for your frame.",
          "Not: letting out the seat, which leaves a visible seam line.",
          "Not: changing the rise, which is effectively rebuilding the trouser.",
        ],
      },
      { t: "h2", text: "Fabric decides the season" },
      {
        t: "p",
        text: "Linen and cotton-silk blends breathe and crease; the crease is the point, and ironing them flat every morning defeats the fabric. Flannel and corduroy have weight and warmth, hang straight, and hide a lot. Silk-wool blends sit between the two, with drape that works through most of the year.",
      },
      { t: "h2", text: "What we stock" },
      {
        t: "p",
        text: "Barena's Cordier, Sesto and Bativoga cuts cover most rises and weights, and Cale runs flannel, cotton gabardine, corduroy and silk-wool through the season. Come and try them on — it takes five minutes and saves a return.",
      },
    ],
  },
]

export function getPost(slug: string) {
  return POSTS.find((post) => post.slug === slug)
}
