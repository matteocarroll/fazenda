import type { ReactNode } from "react"

/* The brown used for text across the rest of the site. */
const BROWN = "#5c3317"

const JOURNEY = `# Customer Journey

The idea is simple: **the store should remember you.**

Most physical retail treats every visit almost independently. Someone walks in, looks around, maybe buys something, and leaves. Even if they come back six months later, there is often very little memory of who they are, what they liked, what they bought, or what they talked about.

At Fazenda, we want to build the opposite.

The goal is to combine the intimacy of a great neighborhood store, where the owner actually knows his customers, with technology that allows us to do that for hundreds or eventually thousands of people.

Every customer moves through a simple journey:

**Lead → Visited Store → First Purchase → 2+ Purchases**

The objective at every stage is to deepen the relationship and move the customer naturally to the next one.

## 1. Lead

Before someone ever enters Fazenda, they are a lead.

Initially, a lot of these people will come through our existing network. Instead of relying entirely on advertising or waiting for people to discover the store, we proactively invite people in.

For example, I might reach out to someone I already know:

*Come by Fazenda sometime. Would love to catch up, show you what we're building, and grab a coffee.*

But that conversation can also expand the network.

I can ask:

*Is there anyone you think I should meet who would genuinely like what we're doing?*

If they introduce me to someone, I reach out personally. Not with a sales message, but an introduction:

*Would love to meet you. Come by Fazenda sometime and let's grab a coffee.*

The store itself becomes the meeting place.

The goal at this stage isn't necessarily to sell something immediately. **The goal is to get the right person through the door.**

## 2. Visited Store

The moment someone walks into Fazenda, the relationship changes.

This is where the technology begins working in the background.

The salesperson can wear a microphone during the interaction. As we talk naturally with the customer, we learn things:

What brought them in.
What brands they already wear.
What pieces they gravitate toward.
Their sizes.
What they tried on.
What they liked but didn't buy.
Where they live.
What they do.
Upcoming trips or events.
What they're looking for.
Personal details that are useful for serving them better in the future.

The point isn't to turn the interaction into data entry.

**The salesperson should just have a great conversation.**

The technology handles the memory.

When the customer leaves, the relevant information from the interaction is turned into a customer profile in the CRM.

The salesperson can then quickly add anything else that matters:

*Loved the Massimo Alba jacket but wasn't ready to buy it.*

*Usually wears navy and earth tones.*

*Going to Milan next month.*

*Looking for a lightweight jacket for fall.*

*Introduced by John.*

Instead of that knowledge disappearing when the customer walks out, Fazenda keeps it.

## 3. First Purchase

The first purchase shouldn't be the end of the transaction.

It should be the beginning of a more informed relationship.

Now we know significantly more:

What they actually bought.
Their size.
Their price range.
Their brand preferences.
What else they considered.
What conversations we've had with them.

That information should determine what happens next.

If something arrives that we genuinely think they would like, we can message them.

If a brand they bought releases a new collection, we can show them the pieces that make sense specifically for them.

If something they tried on comes back in their size, we can tell them.

Communication can happen through WhatsApp, text, a handwritten card, or whatever channel feels appropriate.

The important distinction is that **communication should be useful, not simply frequent.**

Instead of:

*New collection just arrived!*

It becomes:

*Matteo, this jacket came in today and I immediately thought of you. Same fit as the Barena one you bought, but lighter. I put your size aside if you want to try it.*

## 4. Two or More Purchases

Once someone has purchased multiple times, they are no longer simply a customer.

We should actually know them.

Their profile becomes richer every time they visit, purchase, reply to a message, or interact with us.

Over time, Fazenda should understand:

**Who they are → what they own → what they like → what fits → what they considered → what they need → what we should show them next.**

The experience becomes increasingly personalized.

A great salesperson might be able to maintain this level of knowledge for 30 or 50 customers from memory.

Technology should allow Fazenda to maintain it for hundreds or thousands.

## The Flywheel

The system ultimately becomes:

**Find the right people**
↓
**Invite them into the store**
↓
**Have a genuinely good interaction**
↓
**Capture what we learned**
↓
**Build their customer profile**
↓
**Follow up when there is something relevant**
↓
**First purchase**
↓
**Learn more**
↓
**More relevant recommendations**
↓
**Repeat purchases + stronger relationship**
↓
**Introductions to other people**

And then the cycle starts again.

The technology isn't meant to replace the salesperson.

It's meant to give the salesperson **perfect memory.**

The ambition is to make Fazenda feel like a tiny store that knows every customer personally, even as the number of customers grows.

**A store that remembers what you bought, what you didn't buy, what you liked, what you talked about, and what might actually be worth showing you next.**

That's the experience we're trying to build.`

/* A deliberately small markdown reader: headings, bold, italic and
   paragraphs are all this page needs, so it beats pulling in a library. */
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={k++}>{m[1]}</strong>)
    else out.push(<em key={k++}>{m[2]}</em>)
    last = re.lastIndex
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

function Markdown({ source }: { source: string }) {
  const blocks = source.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean)

  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="mt-10 mb-1 font-semibold"
              style={{ fontSize: "clamp(0.9375rem, 2.4vw, 1.0625rem)" }}
            >
              {block.slice(3)}
            </h2>
          )
        }
        if (block.startsWith("# ")) {
          return (
            <h1
              key={i}
              className="text-center tracking-wide mb-8"
              style={{ fontSize: "clamp(1.125rem, 4vw, 1.5rem)", lineHeight: 1.2 }}
            >
              {block.slice(2)}
            </h1>
          )
        }

        const lines = block.split("\n")
        // Justification stretches any line that ends in a break, so blocks of
        // short lines are left-aligned instead. The flywheel reads as a
        // diagram, so it is centred.
        const align = lines.length > 1 ? (block.includes("\u2193") ? "center" : "left") : "justify"

        return (
          /* text-align-last also applies to lines ended by <br>, so it has to
             follow the block's alignment or it drags every line back left. */
          <p
            key={i}
            style={{ textAlign: align, textAlignLast: align === "justify" ? "left" : align }}
          >
            {lines.map((line, j) => (
              <span key={j}>
                {inline(line)}
                {j < lines.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        )
      })}
    </>
  )
}

export default function Journey() {
  return (
    <main lang="en" className="journey min-h-screen px-6 py-20" style={{ backgroundColor: "#fff", color: BROWN }}>
      <style>{`
        .journey { font-family: "Times New Roman", Times, serif; }
        .prose p { hyphens: auto; -webkit-hyphens: auto; }
      `}</style>

      <article
        className="prose mx-auto w-full max-w-xl flex flex-col"
        style={{ fontSize: "clamp(0.8125rem, 2vw, 0.9375rem)", lineHeight: 1.75, gap: "1.2em" }}
      >
        <Markdown source={JOURNEY} />
      </article>
    </main>
  )
}
