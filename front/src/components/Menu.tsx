const menuItems = [
  { label: 'Newsletter', href: '#newsletter' },
  { label: 'Événements', href: '#evenements' },
  { label: 'Contact', href: '#contact' },
]

function Menu() {
  return (
    <div className="absolute left-0 right-0 top-0 z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 pt-6">
        <ul className="flex gap-8 text-[11px] uppercase tracking-[0.35em] text-slate-200/80">
          {menuItems.map((item) => (
            <li key={item.href}>
              <a className="transition hover:text-slate-50" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Menu
