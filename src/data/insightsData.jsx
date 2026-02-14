import React from 'react';
import { FaOm } from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';
import {
  GiPalm, GiAries, GiTaurus, GiGemini, GiCancer,
  GiLeo, GiVirgo, GiLibra, GiScorpio,
  GiSagittarius, GiCapricorn, GiAquarius, GiPisces
} from 'react-icons/gi';

export const appointmentData = [
  { title: ['Reiki', 'Healer'], icon: <GiPalm />, link: '/reiki' },
  { title: ['Popular', 'Astrologers'], icon: <IoSparkles />, link: '/astrologers' },
  { title: ['Learn', 'Tarot'], icon: <FaOm />, link: '/tarot' },
  { title: ['Rudrabhishek', 'Pooja'], icon: <FaOm />, link: '/pooja' },
  { title: ['Palm', 'Reader'], icon: <GiPalm />, link: '/palm-reader' },
];

export const zodiacSignsData = [
  { name: "Aries", hindiName: "मेष", icon: <GiAries />, link: "/horoscope/aries" },
  { name: "Taurus", hindiName: "वृषभ", icon: <GiTaurus />, link: "/horoscope/taurus" },
  { name: "Gemini", hindiName: "मिथुन", icon: <GiGemini />, link: "/horoscope/gemini" },
  { name: "Cancer", hindiName: "कर्क", icon: <GiCancer />, link: "/horoscope/cancer" },
  { name: "Leo", hindiName: "सिंह", icon: <GiLeo />, link: "/horoscope/leo" },
  { name: "Virgo", hindiName: "कन्या", icon: <GiVirgo />, link: "/horoscope/virgo" },
  { name: "Libra", hindiName: "तुला", icon: <GiLibra />, link: "/horoscope/libra" },
  { name: "Scorpio", hindiName: "वृश्चिक", icon: <GiScorpio />, link: "/horoscope/scorpio" },
  { name: "Sagittarius", hindiName: "धनु", icon: <GiSagittarius />, link: "/horoscope/sagittarius" },
  { name: "Capricorn", hindiName: "मकर", icon: <GiCapricorn />, link: "/horoscope/capricorn" },
  { name: "Aquarius", hindiName: "कुंभ", icon: <GiAquarius />, link: "/horoscope/aquarius" },
  { name: "Pisces", hindiName: "मीन", icon: <GiPisces />, link: "/horoscope/pisces" },
];