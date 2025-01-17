import React from "react";
import { motion } from "framer-motion";

const TypingAnimation = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: text.length * 0.01 }} // Duration based on text length
      className="inline-block"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.01 }} // Delay for each character
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TypingAnimation;