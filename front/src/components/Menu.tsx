type MenuProps = {
  onNavigate: (target: string) => void
}

const menuItems = [
  { label: 'Newsletter', target: 'newsletter' },
  { label: 'Contact', target: 'contact' },
  { label: 'Mentions legales', target: 'mentions' },
  { label: 'Association', target: 'association' },
  { label: 'Evenements', target: 'evenements' },
  { label: 'Admin', target: 'admin-login' },
]

function Menu({ onNavigate }: MenuProps) {
  return (
    <div className="absolute left-0 right-0 top-0 z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 pt-6">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 rounded-2xl border border-white/20 bg-slate-950/55 px-6 py-3 text-sm uppercase tracking-[0.28em] text-slate-100 backdrop-blur-md sm:text-base">
          {menuItems.map((item) => (
            <li key={item.target}>
              <button
                className="transition hover:text-slate-50"
                type="button"
                onClick={() => onNavigate(item.target)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Menu
