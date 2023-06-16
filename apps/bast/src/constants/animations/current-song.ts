const imgEnterAnim = {
  rotate: 0,
  scale: 1,
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
};

const imgExitAnim = {
  rotate: -180,
  scale: 0,
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
};

const imgChangeAnim = {
  scale: [1, 1.5, 1],
  transition: {
    duration: 0.5,
    ease: "easeInOut",
    stiffness: 260,
    damping: 20,
  },
};

const textEnterAnim = {
  transformOrigin: "left",
  scaleX: 1,
  opacity: 1,
  transition: {
    ease: "easeInOut",
    stiffness: 260,
    damping: 20,
  },
};

const textExitAnim = {
  transformOrigin: "left",
  scaleX: [1, 0],
  opacity: [1, 0],
  transition: {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
};

const textChangeAnim = {
  transformOrigin: "left",
  scaleX: 1,
  opacity: 1,
  transition: {
    ease: "easeInOut",
    stiffness: 260,
    damping: 20,
  },
};

export { imgEnterAnim, imgExitAnim, imgChangeAnim };
export { textEnterAnim, textExitAnim, textChangeAnim };
