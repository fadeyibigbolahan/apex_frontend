import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-xl">APEX Trading</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Empowering individuals to achieve financial freedom through smart
              investments.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/#packages"
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Investment Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/#how-it-works"
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/#faq"
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">+234 800 000 0000</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400">support@apextrading.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin
                  size={18}
                  className="text-gray-400 mt-1 flex-shrink-0"
                />
                <span className="text-gray-400">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Apex Trading Square. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
