type GradientOrbsProps = {
  variant?: 'home' | 'board'
}

const orbsByVariant: Record<NonNullable<GradientOrbsProps['variant']>, string[]> = {
  home: [
    'absolute -left-32 top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.30),transparent_65%)] blur-2xl',
    'absolute right-[-6rem] top-[-4rem] h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.35),transparent_60%)] blur-3xl',
    'absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_60%)] blur-3xl',
  ],
  board: [
    'absolute -left-24 top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.26),transparent_65%)] blur-2xl',
    'absolute right-[-5rem] top-[-4rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.30),transparent_60%)] blur-3xl',
    'absolute bottom-[-9rem] left-1/2 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.20),transparent_60%)] blur-3xl',
  ],
}

export const GradientOrbs = ({ variant = 'home' }: GradientOrbsProps) => {
  const orbs = orbsByVariant[variant]

  return (
    <div className='pointer-events-none absolute inset-0'>
      {orbs.map((orb) => (
        <div key={orb} className={orb} />
      ))}
    </div>
  )
}
