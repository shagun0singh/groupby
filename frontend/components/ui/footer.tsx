import Link from 'next/link'

// Import generic icons from lucide-react
import {
    Globe,
    Share2,
    MessageCircle,
    Link as LinkIcon,
    Send,
    Feather,
} from 'lucide-react'

const links = [
    {
        title: 'Features',
        href: '/events',
    },
    {
        title: 'Host Event',
        href: '/host',
    },
    {
        title: 'Discover',
        href: '/events',
    },
    {
        title: 'Pricing',
        href: '#',
    },
    {
        title: 'Help',
        href: '#',
    },
    {
        title: 'About',
        href: '#',
    },
]

export default function FooterSection() {
    return (
        <footer className="py-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mb-4 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.href}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block duration-150">
                            <span>{link.title}</span>
                        </Link>
                    ))}
                </div>
                <div className="mb-4 flex flex-wrap justify-center gap-6 text-sm">
                    {/* Using generic icons for social links */}
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social Link 1"
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block">
                        <Share2 className="size-6" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social Link 2"
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block">
                        <MessageCircle className="size-6" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social Link 3"
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block">
                        <LinkIcon className="size-6" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social Link 4"
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block">
                        <Globe className="size-6" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social Link 5"
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block">
                        <Send className="size-6" />
                    </Link>
                    <Link
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Social Link 6"
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white block">
                        <Feather className="size-6" />
                    </Link>
                </div>
                <span className="text-slate-600 dark:text-slate-400 block text-center text-sm">
                    © {new Date().getFullYear()} GroupBy. All rights reserved.
                </span>
            </div>
        </footer>
    )
}

