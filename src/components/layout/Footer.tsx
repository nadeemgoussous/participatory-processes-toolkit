// The hosted site carries a copy of the offline build (see scripts/copy-offline.mjs).
// The offline build itself has no such file beside it, so it hides the link.
const OFFLINE_FILE = 'participatory-processes-toolkit-offline.html'
const showDownload = import.meta.env.MODE !== 'offline' && import.meta.env.PROD

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white print:hidden">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600">
        <p>
          Based on IRENA (2025), <em>Participatory processes for strategic energy planning: A
          toolkit for national energy planners</em>, International Renewable Energy Agency, Abu
          Dhabi. ISBN 978-92-9260-680-0.
        </p>
        <p className="mt-2">
          Your plan is stored in this browser only. Use Export to keep a copy or share it.
        </p>
        {showDownload && (
          <p className="mt-2">
            <a
              href={`./${OFFLINE_FILE}`}
              download={OFFLINE_FILE}
              className="font-medium text-[var(--color-irena-blue)] hover:underline"
            >
              Download the offline version
            </a>{' '}
            — a single file that opens in a browser with no internet connection, for use at
            workshops or from a USB drive. Plans are exported and imported in the same way.
          </p>
        )}
      </div>
    </footer>
  )
}
