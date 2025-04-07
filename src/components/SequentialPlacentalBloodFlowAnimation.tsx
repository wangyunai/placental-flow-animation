import React, { useState, useEffect } from 'react';
import './SequentialPlacentalBloodFlowAnimation.css';

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
}

const SequentialPlacentalBloodFlowAnimation: React.FC = () => {
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [autoProgress, setAutoProgress] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  
  // Stage descriptions
  const stageDescriptions = [
    "Initial state - Placenta structure",
    "Stage 1: Maternal blood enters from spiral arteries",
    "Stage 2: Maternal blood fills intervillous space",
    "Stage 3: Fetal blood enters through umbilical arteries",
    "Stage 4: Fetal blood flows through villous trees",
    "Stage 5: Exchange of gases and nutrients occurs",
    "Stage 6: Oxygenated fetal blood returns through umbilical vein",
    "Stage 7: Deoxygenated maternal blood exits through decidual veins",
    "Stage 8: Complete circulation (all flows active)"
  ];
  
  // Handle animation timing
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    
    if (isPlaying) {
      animationInterval = setInterval(() => {
        setAnimationProgress(prev => {
          const newProgress = prev + speed;
          
          // Auto-progress to next stage if enabled
          if (newProgress >= 100 && autoProgress) {
            setTimeout(() => {
              setStage(prevStage => (prevStage < 8 ? prevStage + 1 : 0));
              setAnimationProgress(0);
            }, 500);
            return 100;
          }
          
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 50);
    }
    
    return () => clearInterval(animationInterval);
  }, [isPlaying, speed, autoProgress]);
  
  // Reset progress when stage changes
  useEffect(() => {
    setAnimationProgress(0);
  }, [stage]);
  
  const generateParticles = (): Particle[] => {
    const particles: Particle[] = [];
    const randomFactor = Math.sin(Date.now() / 1000);
    
    // Stage 1: Maternal blood enters from spiral arteries
    if (stage >= 1) {
      const count = stage === 1 ? Math.ceil((animationProgress / 100) * 15) : 15;
      for (let i = 0; i < count; i++) {
        const xOffset = (i % 3) * 150 + 250 + Math.sin(i * 0.5 + randomFactor) * 10;
        const progress = i * 7 % 100;
        const yOffset = 450 - (progress * 3 * Math.min(1, animationProgress / 50));
        
        if (yOffset > 350) {
          particles.push({
            x: xOffset,
            y: yOffset,
            color: '#B22222', // Red for oxygenated maternal blood
            size: 4,
            opacity: 0.8
          });
        }
      }
    }
    
    // Stage 2: Maternal blood fills intervillous space
    if (stage >= 2) {
      const count = stage === 2 ? Math.ceil((animationProgress / 100) * 30) : 30;
      for (let i = 0; i < count; i++) {
        const angle = i * 0.2 + randomFactor;
        const radius = 80 + (i % 5) * 30;
        const x = 400 + Math.cos(angle) * radius;
        const y = 300 + Math.sin(angle) * radius * 0.5;
        
        if (x > 180 && x < 620 && y > 180 && y < 380) {
          // Color transitions near villi in stage 5+
          let color = '#B22222';
          if (stage >= 5) {
            const distToVilli = Math.min(
              Math.abs(x - 280),
              Math.abs(x - 400),
              Math.abs(x - 520)
            );
            
            if (distToVilli < 30) {
              const exchangeFactor = stage === 5 ? 
                (animationProgress / 100) * (1 - distToVilli / 30) : 
                (1 - distToVilli / 30);
              
              const r = Math.floor(178 * (1 - exchangeFactor) + 70 * exchangeFactor);
              const g = Math.floor(34 * (1 - exchangeFactor) + 130 * exchangeFactor);
              const b = Math.floor(34 * (1 - exchangeFactor) + 180 * exchangeFactor);
              
              color = `rgb(${r}, ${g}, ${b})`;
            }
          }
          
          particles.push({
            x,
            y,
            color,
            size: 2 + Math.random() * 2,
            opacity: 0.6 + Math.random() * 0.4
          });
        }
      }
    }
    
    // Stage 3: Fetal blood enters through umbilical arteries
    if (stage >= 3) {
      const count = stage === 3 ? Math.ceil((animationProgress / 100) * 10) : 10;
      for (let i = 0; i < count; i++) {
        const progress = i * 10 % 100;
        const yOffset = 20 + progress * 1.3;
        
        if (yOffset < 150) {
          // Left umbilical artery
          particles.push({
            x: 390 - 10 * Math.sin(progress / 8),
            y: yOffset,
            color: '#B22222', // Red for deoxygenated fetal blood
            size: 3,
            opacity: 0.8
          });
          
          // Right umbilical artery
          particles.push({
            x: 410 + 10 * Math.sin(progress / 8),
            y: yOffset,
            color: '#B22222',
            size: 3,
            opacity: 0.8
          });
        }
      }
    }
    
    // Stage 4: Fetal blood flows through villous trees
    if (stage >= 4) {
      const count = stage === 4 ? Math.ceil((animationProgress / 100) * 15) : 15;
      
      // Horizontal chorionic arteries
      for (let i = 0; i < count; i++) {
        const side = i % 2; // 0 for left, 1 for right
        const progress = i * 6 % 60;
        
        if (side === 0) { // Left branch
          particles.push({
            x: 400 - progress * 2,
            y: 150 + Math.sin(progress / 5) * 5,
            color: '#B22222',
            size: 3,
            opacity: 0.8
          });
        } else { // Right branch
          particles.push({
            x: 400 + progress * 2,
            y: 150 + Math.sin(progress / 5) * 5,
            color: '#B22222',
            size: 3,
            opacity: 0.8
          });
        }
      }
      
      // Vertical villous branches
      for (let i = 0; i < count; i++) {
        const villousType = i % 3; // 0 for left, 1 for middle, 2 for right
        const progress = i * 5 % 80;
        const phase = progress / 80;
        
        let baseX = 280; // Left villous
        if (villousType === 1) baseX = 400; // Middle villous
        if (villousType === 2) baseX = 520; // Right villous
        
        const x = baseX + Math.sin(phase * Math.PI * 3) * 15;
        const y = 200 + phase * 100;
        
        // Color transition in stage 5+
        let color = '#B22222';
        if (stage >= 5 && phase > 0.5) {
          const transitionPoint = stage === 5 ? (animationProgress / 100) * 0.5 : 0.5;
          const factor = Math.min(1, (phase - transitionPoint) * 2);
          
          const r = Math.floor(178 * (1 - factor) + 70 * factor);
          const g = Math.floor(34 * (1 - factor) + 142 * factor);
          const b = Math.floor(34 * (1 - factor) + 186 * factor);
          
          color = `rgb(${r}, ${g}, ${b})`;
        }
        
        particles.push({
          x,
          y,
          color,
          size: 2,
          opacity: 0.8
        });
      }
    }
    
    // Stage 6: Oxygenated fetal blood returns through umbilical vein
    if (stage >= 6) {
      const count = stage === 6 ? Math.ceil((animationProgress / 100) * 10) : 10;
      
      // Horizontal converging veins
      for (let i = 0; i < count; i++) {
        const side = i % 2; // 0 for left, 1 for right
        const progress = i * 8 % 80;
        
        if (side === 0 && progress < 60) { // Left branch
          particles.push({
            x: 280 + progress * 2,
            y: 180 - Math.sin(progress / 5) * 5,
            color: '#4682B4', // Blue for oxygenated fetal blood
            size: 3,
            opacity: 0.8
          });
        } else if (progress < 60) { // Right branch
          particles.push({
            x: 520 - progress * 2,
            y: 180 - Math.sin(progress / 5) * 5,
            color: '#4682B4',
            size: 3,
            opacity: 0.8
          });
        }
      }
      
      // Umbilical vein
      for (let i = 0; i < count; i++) {
        const progress = i * 10 % 100;
        const yOffset = 140 - progress * 1.5;
        
        if (yOffset > 0) {
          particles.push({
            x: 400 + Math.sin(progress / 10) * 5,
            y: yOffset,
            color: '#4682B4',
            size: 4,
            opacity: 0.9
          });
        }
      }
    }
    
    // Stage 7: Deoxygenated maternal blood exits through decidual veins
    if (stage >= 7) {
      const count = stage === 7 ? Math.ceil((animationProgress / 100) * 15) : 15;
      for (let i = 0; i < count; i++) {
        const veinType = i % 3; // 0 for left, 1 for middle, 2 for right
        const progress = i * 6 % 80;
        
        let baseX = 300; // Left vein
        if (veinType === 1) baseX = 400; // Middle vein
        if (veinType === 2) baseX = 500; // Right vein
        
        const x = baseX + Math.sin(progress / 10) * 10;
        const y = 320 + progress * 1.6;
        
        if (y < 450) {
          particles.push({
            x,
            y,
            color: '#4682B4',
            size: 4,
            opacity: 0.8
          });
        }
      }
    }
    
    return particles;
  };
  
  // Handle next stage button
  const handleNextStage = () => {
    setStage(prevStage => (prevStage < 8 ? prevStage + 1 : 8));
    setAnimationProgress(0);
    setIsPlaying(true);
  };
  
  // Handle previous stage button
  const handlePrevStage = () => {
    setStage(prevStage => (prevStage > 0 ? prevStage - 1 : 0));
    setAnimationProgress(0);
    setIsPlaying(true);
  };
  
  // Handle stage jump
  const handleStageClick = (newStage: number) => {
    setStage(newStage);
    setAnimationProgress(0);
    setIsPlaying(true);
  };
  
  // Handle reset button
  const handleReset = () => {
    setStage(0);
    setAnimationProgress(0);
    setIsPlaying(false);
  };
  
  // Create exchange indicator for stage 5
  const renderExchangeIndicators = () => {
    if (stage < 5) return null;
    
    const opacity = stage === 5 ? animationProgress / 100 : 1;
    
    return (
      <g opacity={opacity}>
        {/* Left villous tree exchange */}
        <path d="M260,300 L240,280 L230,300 L240,320 L260,300" fill="#fff" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
        <text x="235" y="303" textAnchor="middle" fontSize="10" fontWeight="bold">O₂</text>
        <path d="M300,300 L320,280 L330,300 L320,320 L300,300" fill="#fff" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
        <text x="320" y="303" textAnchor="middle" fontSize="10" fontWeight="bold">CO₂</text>
        
        {/* Middle villous tree exchange */}
        <path d="M380,300 L360,280 L350,300 L360,320 L380,300" fill="#fff" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
        <text x="358" y="303" textAnchor="middle" fontSize="10" fontWeight="bold">O₂</text>
        <path d="M420,300 L440,280 L450,300 L440,320 L420,300" fill="#fff" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
        <text x="440" y="303" textAnchor="middle" fontSize="10" fontWeight="bold">CO₂</text>
        
        {/* Right villous tree exchange */}
        <path d="M500,300 L480,280 L470,300 L480,320 L500,300" fill="#fff" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
        <text x="480" y="303" textAnchor="middle" fontSize="10" fontWeight="bold">O₂</text>
        <path d="M540,300 L560,280 L570,300 L560,320 L540,300" fill="#fff" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
        <text x="560" y="303" textAnchor="middle" fontSize="10" fontWeight="bold">CO₂</text>
      </g>
    );
  };
  
  // Explanation of each stage
  const getStageExplanation = () => {
    switch(stage) {
      case 0:
        return "The placenta is a specialized organ that forms the interface between maternal and fetal circulations. It has a maternal side (decidua basalis) and a fetal side (chorionic plate) with villous trees extending between them.";
      case 1:
        return "Maternal blood enters the placenta through spiral arteries in the uterine wall. These arteries have been modified during placental development to be low-resistance vessels that deliver oxygenated blood at low pressure.";
      case 2:
        return "Unlike typical circulation, maternal blood doesn't flow within blood vessels in the placenta. Instead, it flows freely throughout the intervillous space, bathing the villous trees containing fetal circulation.";
      case 3:
        return "Deoxygenated fetal blood travels from the fetus through the umbilical cord via two umbilical arteries. In fetal circulation, arteries carry deoxygenated blood while veins carry oxygenated blood - the opposite of normal circulation.";
      case 4:
        return "Fetal blood flows through the chorionic plate and descends into the branching villous trees. Unlike maternal blood, fetal blood remains within blood vessels at all times, flowing at higher pressure through the convoluted network.";
      case 5:
        return "At the terminal villi, only a thin membrane separates maternal and fetal blood, allowing exchange of oxygen, nutrients, and waste products. Oxygen diffuses from maternal to fetal blood, while carbon dioxide and waste move in the opposite direction.";
      case 6:
        return "After receiving oxygen from maternal blood, the now-oxygenated fetal blood returns through the villous vessels, converges in the chorionic plate, and returns to the fetus through the single umbilical vein.";
      case 7:
        return "After delivering oxygen and nutrients, the now-deoxygenated maternal blood exits the intervillous space through decidual veins in the uterine wall, completing the maternal side of placental circulation.";
      case 8:
        return "The complete placental circulation involves two separate non-mixing circulations: (1) Maternal blood flowing freely in the intervillous space, and (2) Fetal blood contained within vessels in the villous trees. This unique arrangement maximizes surface area for exchange while keeping the circulations separate.";
      default:
        return "";
    }
  };
  
  // Generate particles for current stage
  const particles = generateParticles();
  
  return (
    <div className="placental-flow-container">
      <h1 className="title">Sequential Placental Blood Flow Animation</h1>
      <p className="stage-description">{stageDescriptions[stage]}</p>
      
      {/* Progress bar for current stage */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          style={{ width: `${animationProgress}%` }}
        ></div>
      </div>
      
      {/* Main animation area */}
      <div className="animation-area">
        <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          {/* Background */}
          <rect x="0" y="0" width="800" height="500" fill="#f8f9fa" />
          
          {/* Maternal side (decidua basalis) */}
          <path d="M150,450 Q400,500 650,450 L650,380 Q400,420 150,380 Z" fill="#E6A0BC" stroke="#000" strokeWidth="1" />
          {showLabels && <text x="400" y="470" textAnchor="middle" fontSize="14" fontWeight="bold">Decidua Basalis (Maternal Side)</text>}
          
          {/* Placenta body */}
          <path d="M150,380 Q400,420 650,380 L650,200 Q400,160 150,200 Z" fill="#FFC0CB" fillOpacity="0.7" stroke="#000" strokeWidth="1" />
          {showLabels && <text x="400" y="290" textAnchor="middle" fontSize="14" fontWeight="bold">Intervillous Space</text>}
          
          {/* Fetal side (chorionic plate) */}
          <path d="M150,200 Q400,160 650,200 L650,150 Q400,110 150,150 Z" fill="#D896B8" stroke="#000" strokeWidth="1" />
          {showLabels && <text x="400" y="130" textAnchor="middle" fontSize="14" fontWeight="bold">Chorionic Plate (Fetal Side)</text>}
          
          {/* Umbilical cord */}
          <path d="M400,110 C400,80 400,50 400,20" stroke="#4682B4" strokeWidth="15" fill="none" />
          <path d="M400,110 C400,80 400,50 400,20" stroke="#B22222" strokeWidth="7" fill="none" strokeDasharray="1 8" />
          
          {/* Villous trees - outlines only */}
          {/* Left tree */}
          <path d="M280,150 L280,200 Q280,350 320,350 Q360,350 360,200 L360,150" 
                fill="none" stroke="#555" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Middle tree */}
          <path d="M370,150 L370,200 Q370,350 400,350 Q430,350 430,200 L430,150" 
                fill="none" stroke="#555" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Right tree */}
          <path d="M440,150 L440,200 Q440,350 520,350 Q600,350 600,200 L600,150" 
                fill="none" stroke="#555" strokeWidth="1" strokeDasharray="2 2" />
          
          {/* Spiral arteries */}
          <path d="M250,450 Q230,400 250,350" stroke="#B22222" strokeWidth="3" fill="none" />
          <path d="M400,450 Q380,400 400,350" stroke="#B22222" strokeWidth="3" fill="none" />
          <path d="M550,450 Q530,400 550,350" stroke="#B22222" strokeWidth="3" fill="none" />
          
          {/* Decidual veins */}
          <path d="M300,350 Q320,400 300,450" stroke="#4682B4" strokeWidth="3" fill="none" />
          <path d="M500,350 Q520,400 500,450" stroke="#4682B4" strokeWidth="3" fill="none" />
          <path d="M400,350 Q420,400 400,450" stroke="#4682B4" strokeWidth="3" fill="none" />
          
          {/* Exchange indicators */}
          {renderExchangeIndicators()}
          
          {/* Blood particles */}
          {particles.map((particle, index) => (
            <circle 
              key={`particle-${index}`} 
              cx={particle.x} 
              cy={particle.y} 
              r={particle.size} 
              fill={particle.color}
              fillOpacity={particle.opacity}
            />
          ))}
          
          {/* Labels */}
          {showLabels && (
            <>
              <text x="400" y="40" textAnchor="middle" fontSize="12">Umbilical Cord</text>
              <text x="470" y="40" textAnchor="start" fontSize="10" fill="#B22222">Umbilical Arteries (deoxygenated)</text>
              <text x="470" y="60" textAnchor="start" fontSize="10" fill="#4682B4">Umbilical Vein (oxygenated)</text>
              
              <text x="180" y="370" textAnchor="start" fontSize="10" fill="#B22222">Spiral Arteries</text>
              <text x="600" y="370" textAnchor="end" fontSize="10" fill="#4682B4">Decidual Veins</text>
            </>
          )}
        </svg>
      </div>
      
      {/* Controls */}
      <div className="controls">
        <div className="button-group">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="control-button play-button"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button 
            onClick={handlePrevStage}
            disabled={stage === 0}
            className={`control-button ${stage === 0 ? 'disabled' : ''}`}
          >
            Previous
          </button>
          
          <button 
            onClick={handleNextStage}
            disabled={stage === 8}
            className={`control-button ${stage === 8 ? 'disabled' : ''}`}
          >
            Next
          </button>
          
          <button 
            onClick={handleReset}
            className="control-button reset-button"
          >
            Reset
          </button>
        </div>
        
        <div className="settings-group">
          <div className="speed-control">
            <span>Speed:</span>
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.5" 
              value={speed} 
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
            />
            <span>{speed}x</span>
          </div>
          
          <label className="checkbox-control">
            <input 
              type="checkbox" 
              checked={autoProgress} 
              onChange={() => setAutoProgress(!autoProgress)}
            />
            <span>Auto-advance</span>
          </label>
          
          <label className="checkbox-control">
            <input 
              type="checkbox" 
              checked={showLabels} 
              onChange={() => setShowLabels(!showLabels)}
            />
            <span>Labels</span>
          </label>
        </div>
      </div>
      
      {/* Stage navigation */}
      <div className="stage-navigation">
        <h3>Jump to Stage:</h3>
        <div className="stage-buttons">
          {stageDescriptions.map((desc, idx) => (
            <button 
              key={idx}
              onClick={() => handleStageClick(idx)}
              className={`stage-button ${stage === idx ? 'active' : ''}`}
            >
              {desc}
            </button>
          ))}
        </div>
      </div>
      
      {/* Description of current stage */}
      <div className="stage-explanation">
        <h3>Current Stage Explanation:</h3>
        <p>{getStageExplanation()}</p>
      </div>
    </div>
  );
};

export default SequentialPlacentalBloodFlowAnimation; 