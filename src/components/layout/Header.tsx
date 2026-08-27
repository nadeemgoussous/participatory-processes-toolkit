export default function Header() {
  return (
    <header className="bg-[var(--color-irena-blue)] text-white print:bg-white print:text-black">
      <div className="container mx-auto px-4 py-5">
        {/* The page heading is the h1; this masthead names the publication. */}
        <p className="font-[family-name:var(--font-heading)] text-xl font-bold">
          Participatory processes for strategic energy planning
        </p>
        <p className="mt-1 text-sm text-white/80 print:text-gray-600">
          A digital edition of the IRENA toolkit for national energy planners
        </p>
      </div>
    </header>
  )
}
