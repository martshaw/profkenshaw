export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 py-4 border-t">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>Prof Ken Shaw © {currentYear}</p>
      </div>
    </footer>
  )
}
