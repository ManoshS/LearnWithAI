import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Heart,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ];

  const resources = [
    { name: "Documentation", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Roadmap", href: "#" },
    { name: "Community", href: "#" },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/ManoshS", name: "Github" },
    { icon: Twitter, href: "#", name: "Twitter" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/manosh-s-930241273/",
      name: "LinkedIn",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/manosh_s_10/",
      name: "Instagram",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <footer
      className="bg-gray-600  text-gray-300"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20px 20px, #fffff1 2px, transparent 0),
          radial-gradient(circle at 60px 60px, #000000 2px, transparent 0),
          radial-gradient(circle at 100px 40px, #8b4513 2px, transparent 0)
        `,
        backgroundSize: "100px 100px",
      }}
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold text-white">AI Study Hub</h3>
            <p className="text-gray-400 max-w-xs">
              Your personal learning journey starts here. Create custom roadmaps
              and achieve your goals.
            </p>
            <motion.div className="flex space-x-4" variants={containerVariants}>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  variants={itemVariants}
                  whileHover={{ scale: 1.2, color: "#60A5FA" }}
                  className="hover:text-blue-400 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.a
                    href={link.href}
                    className="flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                    <span className="hover:text-blue-400 transition-colors">
                      {link.name}
                    </span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              {resources.map((link) => (
                <motion.li key={link.name} variants={itemVariants}>
                  <motion.a
                    href={link.href}
                    className="flex items-center group"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                    <span className="hover:text-blue-400 transition-colors">
                      {link.name}
                    </span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <ul className="space-y-3">
              <motion.li variants={itemVariants} className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-400" />
                <span>smanosh73@gmail.com</span>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-400" />
                <span>91+ 9632148911</span>
              </motion.li>
              <motion.li variants={itemVariants} className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-400" />
                <span>Devanahalli , Bengaluru ,Karnataka</span>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-800 text-center"
        >
          <p className="flex items-center justify-center text-gray-400">
            Made with
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                color: ["#ef4444", "#f87171", "#ef4444"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mx-2"
            >
              <Heart className="w-5 h-5 text-red-500" />
            </motion.div>
            by AI Study Hub Team
          </p>
          <p className="mt-2 text-sm text-gray-500">
            © {new Date().getFullYear()} AI Study Hub . All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
