const TOBACCO = "#43150E"

const MANIFESTO = [
  "We believe physical things and physical experiences will become more important, not less.",
  "As more of life moves online, the things we choose to own, the places we spend time in, and the people we trust to introduce us to something new will carry more meaning.",
  "And yet, most physical retail still works in a surprisingly impersonal way.",
  "You can walk into a store that has great items, or a great sales person, discover something you love or in the future could love, even make a purchase, and never hear from that store again. Or maybe just a few emails here and there.",
  "There is very little effort to understand you, stay in touch, or help you discover what might be relevant next. And even if you make a purchase, little effort to remember your name if you ever go back.",
  "At the same time, there are countless products, brands, and stores that could be perfect for you, but you may never know they exist.",
  "With physical goods and in person experiences becoming more important, how can these authentic stores still be run so badly?",
  "The relationship between a store and a customer should not end at the transaction. It should begin there.",
  "Fazenda is at first a personal attempt to build a different kind of store. Both in terms of curation, and most importantly in terms of operation. Think of it as an experimentation store.",
  "We want to carefully curate products and brands we believe in, particularly independent businesses with real identity, limited distribution, and people behind them.",
  "But the larger idea is build the most efficient and powerful sales + nurturing engine to power the store.",
  "Someone may first discover Fazenda, then visit, then buy something for the first time. From there, our job is to understand them better, introduce them to things they may genuinely like, invite them back, and over time become a trusted resource. Anyone who we get exposed to becomes a lead, and our goal is to funnel them to becoming a 2+ purchase customer at least.",
  "We want someone to be able to message us when they need a jacket, a gift, a pair of shoes, or simply an opinion, and trust that we will help them find the right thing.",
  "Technology makes it possible to do this at a level that was previously difficult for a small independent store. It can be hyper personalized and yet done in bulk/ We want to use it to remember better, communicate better, follow up more thoughtfully, and make every interaction more personal.",
  "The technology should remain in the background but is crucial for any store to operate the way they are supposed to, especially to compete with online shopping. The relationship should remain human.",
  "Fazenda is where we are testing that idea: a physical store built around great products, personal relationships, and a more thoughtful way of selling.",
]

export default function Manifesto() {
  return (
    <main lang="en" className="manifesto min-h-screen px-6 py-20" style={{ backgroundColor: TOBACCO }}>
      <style>{`
        .manifesto { font-family: "Times New Roman", Times, serif; }

        /* Metallic gold: a gradient with bright highlights, clipped to the
           letterforms, drifting slowly so the light appears to move across. */
        .gold {
          background: linear-gradient(
            110deg,
            #7a5a16 0%, #c9a13b 18%, #fff0b3 30%, #d4af37 42%,
            #8f6b1e 58%, #d4af37 72%, #fff0b3 84%, #b8912e 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gold-sheen 9s ease-in-out infinite alternate;
        }
        @keyframes gold-sheen {
          from { background-position: 0% 50%; }
          to   { background-position: 100% 50%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gold { animation: none; }
        }

        /* The body gets the same moving sheen, but from a lighter range of
           golds — the title's deepest tones are too dark to read against the
           tobacco at text size. Set on the container, so the light sweeps
           across the whole column in one pass rather than per paragraph. */
        .gold-body {
          background: linear-gradient(
            110deg,
            #c9a13b 0%, #f1dc9a 20%, #fff6d2 32%, #e2c46e 46%,
            #c9a13b 60%, #f1dc9a 76%, #fff6d2 88%, #d9b95a 100%
          );
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gold-sheen 9s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .gold-body { animation: none; }
        }

        .justified p {
          text-align: justify;
          text-align-last: left;
          hyphens: auto;
          -webkit-hyphens: auto;
        }
      `}</style>

      <article className="mx-auto w-full max-w-xl">
        <h1
          className="gold text-center tracking-wide"
          style={{ fontSize: "clamp(1.5rem, 6vw, 2.25rem)", lineHeight: 1.1 }}
        >
          Manifesto
        </h1>

        <div
          className="gold-body justified mt-12 flex flex-col"
          style={{ fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)", lineHeight: 1.75, gap: "1.2em" }}
        >
          {MANIFESTO.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </article>
    </main>
  )
}
