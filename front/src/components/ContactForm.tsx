function ContactForm() {
  return (
    <form className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-2 text-sm text-slate-200 sm:col-span-1">
        Nom
        <input
          type="text"
          name="name"
          className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
          placeholder="Votre nom"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-200 sm:col-span-1">
        Email
        <input
          type="email"
          name="email"
          className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
          placeholder="votre@email.com"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-200 sm:col-span-2">
        Message
        <textarea
          name="message"
          rows={4}
          className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
          placeholder="Votre message..."
        />
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
        >
          Envoyer
        </button>
      </div>
    </form>
  )
}

export default ContactForm
