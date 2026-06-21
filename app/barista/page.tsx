export default function Barista() {
  return (
    <main className="min-h-screen bg-white py-12 px-6" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="max-w-xl mx-auto">

        <p className="text-[#5c3317] text-xs mb-10">For Portuguese please scroll down.</p>

        {/* English */}
        <div className="flex flex-col gap-5 text-[#5c3317] text-xs leading-relaxed">
          <div>
            <p className="font-semibold text-sm mb-1">Fazenda</p>
            <p>Fazenda is a Brazil-inspired coffee shop and beer bar in New York City, set inside a curated, premium multibrand menswear store. We're bringing together specialty coffee, Brazilian-style beer, and great style in one space. We're looking for an experienced barista to help bring that vision to life behind the counter.</p>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3">Barista</p>

            <p className="font-semibold mb-2">What You'll Do</p>
            <ul className="flex flex-col gap-1 pl-4 list-disc">
              <li>Prepare and serve specialty coffee and espresso-based drinks with consistency and care</li>
              <li>Pour and serve beer, maintaining proper handling and presentation standards</li>
              <li>Deliver warm, attentive hospitality that reflects the Fazenda brand and its Brazilian roots</li>
              <li>Keep the bar and coffee station clean, organized, and fully stocked</li>
              <li>Educate guests on the menu, offering recommendations and sharing the story behind Fazenda</li>
              <li>Work closely with a small team in a unique retail-meets-café environment</li>
              <li>Have fun and learn while doing so!</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">What We're Looking For</p>
            <ul className="flex flex-col gap-1 pl-4 list-disc">
              <li>Previous experience as a barista required; comfortable working on a commercial espresso machine, preferably a La Marzocco Linea Classic</li>
              <li>Strong customer service skills and a genuine interest for hospitality</li>
              <li>Reliable, detail-oriented, and able to work efficiently during busy periods</li>
              <li>Interest in style, retail, or menswear is a bonus, but not required</li>
              <li>Available for part-time shifts, including weekends</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">Why Fazenda</p>
            <p>Be part of a one-of-a-kind concept that blends Brazilian coffee culture, beer, and fashion in one of the most exciting NYC neighborhoods. This is a great opportunity for someone who wants more than a typical café job, it's a cool opportunity to be part of a distinctive brand from the ground up.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">To apply</p>
            <p>Send a short note about yourself and your experience to{" "}
              <a href="mailto:matteo@fazendacompany.com" className="underline hover:opacity-70 transition-opacity">
                matteo@fazendacompany.com
              </a>.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#5c3317]/20 my-12" />

        {/* Portuguese */}
        <div className="flex flex-col gap-5 text-[#5c3317] text-xs leading-relaxed">
          <div>
            <p className="font-semibold text-sm mb-1">Fazenda</p>
            <p>A Fazenda é uma cafeteria e bar de cervejas de inspiração brasileira em Nova York, situada dentro de uma multimarca masculina curada e premium. Reunimos café especial, cerveja de estilo brasileiro e muito estilo em um único espaço. Estamos procurando um(a) barista experiente para ajudar a dar vida a essa visão atrás do balcão.</p>
          </div>

          <div>
            <p className="font-semibold text-sm mb-3">Barista</p>

            <p className="font-semibold mb-2">O que você vai fazer</p>
            <ul className="flex flex-col gap-1 pl-4 list-disc">
              <li>Preparar e servir café especial e bebidas à base de espresso com consistência e cuidado</li>
              <li>Servir cervejas, mantendo os padrões adequados de manuseio e apresentação</li>
              <li>Oferecer uma hospitalidade calorosa e atenciosa que reflita a marca Fazenda e suas raízes brasileiras</li>
              <li>Manter o bar e a estação de café limpos, organizados e abastecidos</li>
              <li>Apresentar o cardápio aos clientes, fazer recomendações e contar a história da Fazenda</li>
              <li>Trabalhar em equipe em um ambiente único que une varejo e café</li>
              <li>Se divertir e aprender no processo!</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">O que buscamos</p>
            <ul className="flex flex-col gap-1 pl-4 list-disc">
              <li>Experiência prévia como barista obrigatória; familiaridade com máquina de espresso comercial, de preferência La Marzocco Linea Classic</li>
              <li>Boas habilidades de atendimento ao cliente e interesse genuíno por hospitalidade</li>
              <li>Confiável, atento aos detalhes e capaz de trabalhar com eficiência nos períodos movimentados</li>
              <li>Interesse em moda, varejo ou moda masculina é um diferencial, mas não obrigatório</li>
              <li>Disponibilidade para turnos de meio período, incluindo fins de semana</li>
            </ul>
          </div>

          <div>
            <p className="font-semibold mb-2">Por que a Fazenda</p>
            <p>Faça parte de um conceito único que une cultura cafeeira brasileira, cerveja e moda em um dos bairros mais vibrantes de Nova York. É uma ótima oportunidade para quem quer mais do que um trabalho comum em café - é uma chance de fazer parte de uma marca diferenciada desde o início.</p>
          </div>

          <div>
            <p className="font-semibold mb-1">Para se candidatar</p>
            <p>Mande uma mensagem curta sobre você e sua experiência para{" "}
              <a href="mailto:matteo@fazendacompany.com" className="underline hover:opacity-70 transition-opacity">
                matteo@fazendacompany.com
              </a>.
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}
