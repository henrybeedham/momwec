export default function PlayerTab({ colour, className, size = 4 }: { colour: string; className?: string; size?: number }) {
  return <div className={`${className} h-${size} w-${size} rounded-full ${colour}`} />;
}
