
import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const WritingEffect = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Hello there, I'm a software developer from India. I'm currently pursuing a B.Tech in Computer Science. In my journey of software development, I have developed a strong foundation in programming and software development, with particular experience in Next.js and React.",
        "One of my favorite hobbies continues to be tinkering with software configurations, whether it's customizing Neovim setups, tweaking UI elements that don't quite feel right, or hunting for the perfect open-source alternative.",
        "I also love staying updated with the latest tech trends and sharing insights with others through blogs and Twitter posts."
      ],
      typeSpeed: 50,
      backSpeed: 10,
      loop: true,
      backDelay: 2000,
      startDelay: 1000,
      showCursor: true,
      cursorChar: '|',
      contentType: 'html',
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="typed-container">
      <span ref={el}></span>
    </div>
  );
};

export default WritingEffect;
