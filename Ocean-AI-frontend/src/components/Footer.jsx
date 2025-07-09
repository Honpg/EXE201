function Footer() {
  return (
    <footer className="footer-bottom fixed bottom-0 w-full py-3 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-center text-white">
      &copy; {new Date().getFullYear()} Ocean AI. All rights reserved.
    </footer>
  );
}

export default Footer;
