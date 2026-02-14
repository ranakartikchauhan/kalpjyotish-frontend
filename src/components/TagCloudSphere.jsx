// src/components/TagCloudSphere.jsx
// This is our own custom component to wrap the TagCloud library.

import React, { useEffect, useRef } from 'react';
import TagCloud from 'TagCloud';

const TagCloudSphere = ({ tags, radius }) => {
  const containerRef = useRef(null);
  const hasBeenInitialized = useRef(false);

  useEffect(() => {
    // Only initialize the TagCloud once
    if (hasBeenInitialized.current || !containerRef.current) return;

    // The library needs an array of simple strings for the texts
    const texts = tags.map(tag => tag.props.children);
    
    const options = {
      radius: radius || 200,
      maxSpeed: 'normal',
      initSpeed: 'normal',
      keep: true,
    };
    
    TagCloud(containerRef.current, texts, options);
    
    // Mark as initialized
    hasBeenInitialized.current = true;
    
  }, [tags, radius]); // Rerun effect if tags or radius change

  return <div ref={containerRef} className="tagcloud-container" />;
};

export default TagCloudSphere;