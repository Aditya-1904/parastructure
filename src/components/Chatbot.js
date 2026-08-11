'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import styles from './Chatbot.module.css';

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // State for conversation history
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Quick Action Chips State
  const [showChips, setShowChips] = useState(true);

  // Lead generation state
  const [isLeadGenMode, setIsLeadGenMode] = useState(false);
  const [leadGenData, setLeadGenData] = useState({ name: '', phone: '' });
  const [leadGenSubmitted, setLeadGenSubmitted] = useState(false);

  const chatBodyRef = useRef(null);

  // Determine initial greeting based on pathname
  const getInitialGreeting = () => {
    let greeting = "Hi there! 👋 I'm the ParaStructure assistant. Ask me anything about our cohorts.";
    if (pathname?.includes('/courses/rcc')) {
      greeting = "Hi there! 👋 Let me know if you have any questions specifically about the RCC Bridge cohort!";
    } else if (pathname?.includes('/courses/steel')) {
      greeting = "Hi there! 👋 Let me know if you have any questions specifically about the Steel Bridge cohort!";
    } else if (pathname?.includes('/courses/psc')) {
      greeting = "Hi there! 👋 Let me know if you have any questions specifically about the PSC Bridge cohort!";
    } else if (pathname?.includes('/courses/industrial-steel')) {
      greeting = "Hi there! 👋 Let me know if you have any questions specifically about the Industrial Steel Building cohort!";
    }
    return greeting;
  };

  // Initialize from sessionStorage on mount
  useEffect(() => {
    // Make the session key path-agnostic so history is preserved across page navigations
    const saved = sessionStorage.getItem('chatbot_messages_global');
    if (saved) {
      setMessages(JSON.parse(saved));
      setShowChips(false); // If history exists, hide chips
    } else {
      setMessages([
        { sender: 'bot', text: getInitialGreeting() }
      ]);
      setShowChips(true);
    }
  }, [pathname]);

  // Save to sessionStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatbot_messages_global', JSON.stringify(messages));
    }
    // Auto-scroll to bottom
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping, isLeadGenMode]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const userText = textOverride || inputValue;
    if (!userText.trim()) return;

    setInputValue('');
    setShowChips(false);
    
    // Add user message to state
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, pathname })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: "I'm sorry, I encountered an error. Please try again later." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: "Network error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeadGenSubmit = (e) => {
    e.preventDefault();
    if (!leadGenData.name || !leadGenData.phone) return;
    
    // Here you would normally send this to your backend (e.g. Supabase, Email)
    console.log("Lead captured:", leadGenData);
    
    setLeadGenSubmitted(true);
    setMessages((prev) => [...prev, { sender: 'bot', text: `Thanks ${leadGenData.name}! Our team will call you at ${leadGenData.phone} within 24 hours.` }]);
    
    setTimeout(() => {
      setIsLeadGenMode(false);
      setLeadGenSubmitted(false);
    }, 3000);
  };

  const quickActionChips = [
    "Tell me about the courses",
    "What is the fee?",
    "Speak to an expert"
  ];

  const handleChipClick = (chipText) => {
    if (chipText === "Speak to an expert") {
      setIsLeadGenMode(true);
      setShowChips(false);
    } else {
      handleSendMessage(null, chipText);
    }
  };

  return (
    <div className={styles.chatbotWrapper}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerTitleArea}>
              <span className={styles.headerTitle}>Assistant</span>
              <span className={styles.onlineStatus}></span>
            </div>
            <button onClick={toggleChat} className={styles.closeBtn} aria-label="Close chat">×</button>
          </div>
          
          <div className={styles.chatBody} ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`${styles.message} ${msg.sender === 'bot' ? styles.messageBot : styles.messageUser}`}
              >
                {msg.sender === 'bot' ? (
                  <div className={styles.markdownContent}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className={`${styles.message} ${styles.messageBot}`}>
                <div className={styles.typingIndicator}>
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}

            {isLeadGenMode && !leadGenSubmitted && (
              <div className={styles.leadGenFormWrapper}>
                <p className={styles.leadGenText}>Please provide your details so a senior engineer can contact you.</p>
                <form onSubmit={handleLeadGenSubmit} className={styles.leadGenForm}>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={leadGenData.name}
                    onChange={(e) => setLeadGenData({...leadGenData, name: e.target.value})}
                    required
                    className={styles.inputField}
                  />
                  <input 
                    type="tel" 
                    placeholder="Your Phone Number" 
                    value={leadGenData.phone}
                    onChange={(e) => setLeadGenData({...leadGenData, phone: e.target.value})}
                    required
                    className={styles.inputField}
                  />
                  <div className={styles.leadGenActions}>
                    <button type="button" onClick={() => setIsLeadGenMode(false)} className={styles.cancelBtn}>Cancel</button>
                    <button type="submit" className={styles.submitBtn}>Submit</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {!isLeadGenMode && (
            <div className={styles.chatFooter}>
              {showChips && (
                <div className={styles.chipsContainer}>
                  {quickActionChips.map((chip, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleChipClick(chip)} 
                      className={styles.actionChip}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              
              <form onSubmit={(e) => handleSendMessage(e)} className={styles.inputForm}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  className={styles.chatInput}
                  disabled={isTyping}
                />
                <button type="submit" className={styles.sendBtn} disabled={!inputValue.trim() || isTyping}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <button onClick={toggleChat} className={styles.triggerBtn} aria-label="Toggle chat">
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>
    </div>
  );
}
