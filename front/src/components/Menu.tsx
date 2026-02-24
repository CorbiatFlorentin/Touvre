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
        <ul className="flex gap-8 text-[11px] uppercase tracking-[0.35em] text-slate-200/80">
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
