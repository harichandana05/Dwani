import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, Square, ArrowLeft, Award, RefreshCw, AudioLines, Volume2, FastForward, Play } from 'lucide-react';
import axios from 'axios';
import API_BASE from '../api';

const SWARAS = ["Sa", "Ri1", "Ri2", "Ga2", "Ga3", "Ma1", "Ma2", "Pa", "Da1", "Da2", "Ni2", "Ni3"];
const AAROHANAM_FULL = [
  "Sa", "Ri1", "Ga2", "Ma1", "Pa", "Da1", "Ni3", "HighSa",
  "HighSa", "Ni3", "Da1", "Pa", "Ma1", "Ga2", "Ri1", "Sa"
];
const JANTA_SWARALU = [
  "Sa", "Sa", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1",
  "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "HighSa", "HighSa",
  "HighSa", "HighSa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa",
  "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Sa", "Sa"
];
const JANTA_SWARALU_2 = [
  "Sa", "Sa", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", 
  "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", 
  "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", 
  "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", 
  "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "HighSa", "HighSa", 
  "HighSa", "HighSa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", 
  "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", 
  "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", 
  "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", 
  "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Sa", "Sa"
];

const JANTA_2_LYRICS = [
  "S S R R  |  G G  |  M M  ||",
  "R R G G  |  M M  |  P P  ||",
  "G G M M  |  P P  |  D D  ||",
  "M M P P  |  D D  |  N N  ||",
  "P P D D  |  N N  |  Ṡ Ṡ  ||",
  "Ṡ Ṡ N N  |  D D  |  P P  ||",
  "N N D D  |  P P  |  M M  ||",
  "D D P P  |  M M  |  G G  ||",
  "P P M M  |  G G  |  R R  ||",
  "M M G G  |  R R  |  S S  ||"
];

const JANTA_SWARALU_3 = [
  "Sa", "Sa", "Ri1", "Ri1", "Ga2", "Ga2", "Ri1", "Ri1", "Sa", "Sa", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1",
  "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa",
  "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1",
  "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3",
  "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "HighSa", "HighSa",
  "HighSa", "HighSa", "Ni3", "Ni3", "Da1", "Da1", "Ni3", "Ni3", "HighSa", "HighSa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa",
  "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1",
  "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2",
  "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1",
  "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Sa", "Sa"
];

const JANTA_3_LYRICS = [
  "S S R R | G G | R R || S S R R | G G | M M ||",
  "R R G G | M M | G G || R R G G | M M | P P ||",
  "G G M M | P P | M M || G G M M | P P | D D ||",
  "M M P P | D D | P P || M M P P | D D | N N ||",
  "P P D D | N N | D D || P P D D | N N | Ṡ Ṡ ||",
  "Ṡ Ṡ N N | D D | N N || Ṡ Ṡ N N | D D | P P ||",
  "N N D D | P P | D D || N N D D | P P | M M ||",
  "D D P P | M M | P P || D D P P | M M | G G ||",
  "P P M M | G G | M M || P P M M | G G | R R ||",
  "M M G G | R R | G G || M M G G | R R | S S ||"
];

const JANTA_SWARALU_4 = [
  "Sa", "Sa", "Ri1", "Sa", "Sa", "Ri1", "Sa", "Ri1", "Sa", "Sa", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1",
  "Ri1", "Ri1", "Ga2", "Ri1", "Ri1", "Ga2", "Ri1", "Ga2", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa",
  "Ga2", "Ga2", "Ma1", "Ga2", "Ga2", "Ma1", "Ga2", "Ma1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1",
  "Ma1", "Ma1", "Pa", "Ma1", "Ma1", "Pa", "Ma1", "Pa", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3",
  "Pa", "Pa", "Da1", "Pa", "Pa", "Da1", "Pa", "Da1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "HighSa", "HighSa",
  "HighSa", "HighSa", "Ni3", "HighSa", "HighSa", "Ni3", "HighSa", "Ni3", "HighSa", "HighSa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa",
  "Ni3", "Ni3", "Da1", "Ni3", "Ni3", "Da1", "Ni3", "Da1", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1",
  "Da1", "Da1", "Pa", "Da1", "Da1", "Pa", "Da1", "Pa", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2",
  "Pa", "Pa", "Ma1", "Pa", "Pa", "Ma1", "Pa", "Ma1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1",
  "Ma1", "Ma1", "Ga2", "Ma1", "Ma1", "Ga2", "Ma1", "Ga2", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Sa", "Sa"
];

const JANTA_4_LYRICS = [
  "S S R S | S R | S R || S S R R | G G | M M ||",
  "R R G R | R G | R G || R R G G | M M | P P ||",
  "G G M G | G M | G M || G G M M | P P | D D ||",
  "M M P M | M P | M P || M M P P | D D | N N ||",
  "P P D P | P D | P D || P P D D | N N | Ṡ Ṡ ||",
  "Ṡ Ṡ N Ṡ | Ṡ N | Ṡ N || Ṡ Ṡ N N | D D | P P ||",
  "N N D N | N D | N D || N N D D | P P | M M ||",
  "D D P D | D P | D P || D D P P | M M | G G ||",
  "P P M P | P M | P M || P P M M | G G | R R ||",
  "M M G M | M G | M G || M M G G | R R | S S ||"
];

const JANTA_SWARALU_5 = [
  "Sa", "Sa_ext", "Sa", "Ri1", "Ri1_ext", "Ri1", "Ga2", "Ga2", "Sa", "Sa", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1",
  "Ri1", "Ri1_ext", "Ri1", "Ga2", "Ga2_ext", "Ga2", "Ma1", "Ma1", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa",
  "Ga2", "Ga2_ext", "Ga2", "Ma1", "Ma1_ext", "Ma1", "Pa", "Pa", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1",
  "Ma1", "Ma1_ext", "Ma1", "Pa", "Pa_ext", "Pa", "Da1", "Da1", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3",
  "Pa", "Pa_ext", "Pa", "Da1", "Da1_ext", "Da1", "Ni3", "Ni3", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "HighSa", "HighSa",
  "HighSa", "HighSa_ext", "HighSa", "Ni3", "Ni3_ext", "Ni3", "Da1", "Da1", "HighSa", "HighSa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa",
  "Ni3", "Ni3_ext", "Ni3", "Da1", "Da1_ext", "Da1", "Pa", "Pa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1",
  "Da1", "Da1_ext", "Da1", "Pa", "Pa_ext", "Pa", "Ma1", "Ma1", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2",
  "Pa", "Pa_ext", "Pa", "Ma1", "Ma1_ext", "Ma1", "Ga2", "Ga2", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1",
  "Ma1", "Ma1_ext", "Ma1", "Ga2", "Ga2_ext", "Ga2", "Ri1", "Ri1", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Sa", "Sa"
];

const JANTA_5_LYRICS = [
  "S , S R | , R | G G || S S R R | G G | M M ||",
  "R , R G | , G | M M || R R G G | M M | P P ||",
  "G , G M | , M | P P || G G M M | P P | D D ||",
  "M , M P | , P | D D || M M P P | D D | N N ||",
  "P , P D | , D | N N || P P D D | N N | Ṡ Ṡ ||",
  "Ṡ , Ṡ N | , N | D D || Ṡ Ṡ N N | D D | P P ||",
  "N , N D | , D | P P || N N D D | P P | M M ||",
  "D , D P | , P | M M || D D P P | M M | G G ||",
  "P , P M | , M | G G || P P M M | G G | R R ||",
  "M , M G | , G | R R || M M G G | R R | S S ||"
];

const JANTA_SWARALU_6 = [
  "Sa", "Sa", "Sa_ext", "Ri1", "Ri1", "Ri1_ext", "Ga2", "Ga2", "Sa", "Sa", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1",
  "Ri1", "Ri1", "Ri1_ext", "Ga2", "Ga2", "Ga2_ext", "Ma1", "Ma1", "Ri1", "Ri1", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa",
  "Ga2", "Ga2", "Ga2_ext", "Ma1", "Ma1", "Ma1_ext", "Pa", "Pa", "Ga2", "Ga2", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1",
  "Ma1", "Ma1", "Ma1_ext", "Pa", "Pa", "Pa_ext", "Da1", "Da1", "Ma1", "Ma1", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3",
  "Pa", "Pa", "Pa_ext", "Da1", "Da1", "Da1_ext", "Ni3", "Ni3", "Pa", "Pa", "Da1", "Da1", "Ni3", "Ni3", "HighSa", "HighSa",
  "HighSa", "HighSa", "HighSa_ext", "Ni3", "Ni3", "Ni3_ext", "Da1", "Da1", "HighSa", "HighSa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa",
  "Ni3", "Ni3", "Ni3_ext", "Da1", "Da1", "Da1_ext", "Pa", "Pa", "Ni3", "Ni3", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1",
  "Da1", "Da1", "Da1_ext", "Pa", "Pa", "Pa_ext", "Ma1", "Ma1", "Da1", "Da1", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2",
  "Pa", "Pa", "Pa_ext", "Ma1", "Ma1", "Ma1_ext", "Ga2", "Ga2", "Pa", "Pa", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1",
  "Ma1", "Ma1", "Ma1_ext", "Ga2", "Ga2", "Ga2_ext", "Ri1", "Ri1", "Ma1", "Ma1", "Ga2", "Ga2", "Ri1", "Ri1", "Sa", "Sa"
];

const JANTA_6_LYRICS = [
  "S S , R | R , | G G || S S R R | G G | M M ||",
  "R R , G | G , | M M || R R G G | M M | P P ||",
  "G G , M | M , | P P || G G M M | P P | D D ||",
  "M M , P | P , | D D || M M P P | D D | N N ||",
  "P P , D | D , | N N || P P D D | N N | Ṡ Ṡ ||",
  "Ṡ Ṡ , N | N , | D D || Ṡ Ṡ N N | D D | P P ||",
  "N N , D | D , | P P || N N D D | P P | M M ||",
  "D D , P | P , | M M || D D P P | M M | G G ||",
  "P P , M | M , | G G || P P M M | G G | R R ||",
  "M M , G | G , | R R || M M G G | R R | S S ||"
];

const ALANKARAM_1_SWARALU = [
  "Sa", "Ri1", "Ga2", "Ma1", "Ga2", "Ri1", "Sa", "Ri1", "Ga2", "Ri1", "Sa", "Ri1", "Ga2", "Ma1",
  "Ri1", "Ga2", "Ma1", "Pa", "Ma1", "Ga2", "Ri1", "Ga2", "Ma1", "Ga2", "Ri1", "Ga2", "Ma1", "Pa",
  "Ga2", "Ma1", "Pa", "Da1", "Pa", "Ma1", "Ga2", "Ma1", "Pa", "Ma1", "Ga2", "Ma1", "Pa", "Da1",
  "Ma1", "Pa", "Da1", "Ni3", "Da1", "Pa", "Ma1", "Pa", "Da1", "Pa", "Ma1", "Pa", "Da1", "Ni3",
  "Pa", "Da1", "Ni3", "HighSa", "Ni3", "Da1", "Pa", "Da1", "Ni3", "Da1", "Pa", "Da1", "Ni3", "HighSa",
  "HighSa", "Ni3", "Da1", "Pa", "Da1", "Ni3", "HighSa", "Ni3", "Da1", "Ni3", "HighSa", "Ni3", "Da1", "Pa",
  "Ni3", "Da1", "Pa", "Ma1", "Pa", "Da1", "Ni3", "Da1", "Pa", "Da1", "Ni3", "Da1", "Pa", "Ma1",
  "Da1", "Pa", "Ma1", "Ga2", "Ma1", "Pa", "Da1", "Pa", "Ma1", "Pa", "Da1", "Pa", "Ma1", "Ga2",
  "Pa", "Ma1", "Ga2", "Ri1", "Ga2", "Ma1", "Pa", "Ma1", "Ga2", "Ma1", "Pa", "Ma1", "Ga2", "Ri1",
  "Ma1", "Ga2", "Ri1", "Sa", "Ri1", "Ga2", "Ma1", "Ga2", "Ri1", "Ga2", "Ma1", "Ga2", "Ri1", "Sa"
];

const ALANKARAM_1_LYRICS = [
  "S R G M | G R | S R G R | S R G M ||",
  "R G M P | M G | R G M G | R G M P ||",
  "G M P D | P M | G M P M | G M P D ||",
  "M P D N | D P | M P D P | M P D N ||",
  "P D N Ṡ | N D | P D N D | P D N Ṡ ||",
  "Ṡ N D P | D N | Ṡ N D N | Ṡ N D P ||",
  "N D P M | P D | N D P D | N D P M ||",
  "D P M G | M P | D P M P | D P M G ||",
  "P M G R | G M | P M G M | P M G R ||",
  "M G R S | R G | M G R G | M G R S ||"
];

const ALANKARAM_2_SWARALU = [
  "Sa", "Ri1", "Ga2", "Ri1", "Sa", "Ri1", "Sa", "Ri1", "Ga2", "Ma1",
  "Ri1", "Ga2", "Ma1", "Ga2", "Ri1", "Ga2", "Ri1", "Ga2", "Ma1", "Pa",
  "Ga2", "Ma1", "Pa", "Ma1", "Ga2", "Ma1", "Ga2", "Ma1", "Pa", "Da1",
  "Ma1", "Pa", "Da1", "Pa", "Ma1", "Pa", "Ma1", "Pa", "Da1", "Ni3",
  "Pa", "Da1", "Ni3", "Da1", "Pa", "Da1", "Pa", "Da1", "Ni3", "HighSa",
  "HighSa", "Ni3", "Da1", "Ni3", "HighSa", "Ni3", "HighSa", "Ni3", "Da1", "Pa",
  "Ni3", "Da1", "Pa", "Da1", "Ni3", "Da1", "Ni3", "Da1", "Pa", "Ma1",
  "Da1", "Pa", "Ma1", "Pa", "Da1", "Pa", "Da1", "Pa", "Ma1", "Ga2",
  "Pa", "Ma1", "Ga2", "Ma1", "Pa", "Ma1", "Pa", "Ma1", "Ga2", "Ri1",
  "Ma1", "Ga2", "Ri1", "Ga2", "Ma1", "Ga2", "Ma1", "Ga2", "Ri1", "Sa"
];

const ALANKARAM_2_LYRICS = [
  "S R G R | S R | S R G M ||",
  "R G M G | R G | R G M P ||",
  "G M P M | G M | G M P D ||",
  "M P D P | M P | M P D N ||",
  "P D N D | P D | P D N Ṡ ||",
  "Ṡ N D N | Ṡ N | Ṡ N D P ||",
  "N D P D | N D | N D P M ||",
  "D P M P | D P | D P M G ||",
  "P M G M | P M | P M G R ||",
  "M G R G | M G | M G R S ||"
];

const ALANKARAM_3_SWARALU = [
  "Sa", "Ri1", "Sa", "Ri1", "Ga2", "Ma1",
  "Ri1", "Ga2", "Ri1", "Ga2", "Ma1", "Pa",
  "Ga2", "Ma1", "Ga2", "Ma1", "Pa", "Da1",
  "Ma1", "Pa", "Ma1", "Pa", "Da1", "Ni3",
  "Pa", "Da1", "Pa", "Da1", "Ni3", "HighSa",
  "HighSa", "Ni3", "HighSa", "Ni3", "Da1", "Pa",
  "Ni3", "Da1", "Ni3", "Da1", "Pa", "Ma1",
  "Da1", "Pa", "Da1", "Pa", "Ma1", "Ga2",
  "Pa", "Ma1", "Pa", "Ma1", "Ga2", "Ri1",
  "Ma1", "Ga2", "Ma1", "Ga2", "Ri1", "Sa"
];

const ALANKARAM_3_LYRICS = [
  "S R | S R G M ||",
  "R G | R G M P ||",
  "G M | G M P D ||",
  "M P | M P D N ||",
  "P D | P D N Ṡ ||",
  "Ṡ N | Ṡ N D P ||",
  "N D | N D P M ||",
  "D P | D P M G ||",
  "P M | P M G R ||",
  "M G | M G R S ||"
];

const ALANKARAM_5_SWARALU = [
  "Sa", "Ri1", "Ga2", "Sa", "Ri1", "Ga2", "Ma1",
  "Ri1", "Ga2", "Ma1", "Ri1", "Ga2", "Ma1", "Pa",
  "Ga2", "Ma1", "Pa", "Ga2", "Ma1", "Pa", "Da1",
  "Ma1", "Pa", "Da1", "Ma1", "Pa", "Da1", "Ni3",
  "Pa", "Da1", "Ni3", "Pa", "Da1", "Ni3", "HighSa",
  "HighSa", "Ni3", "Da1", "HighSa", "Ni3", "Da1", "Pa",
  "Ni3", "Da1", "Pa", "Ni3", "Da1", "Pa", "Ma1",
  "Da1", "Pa", "Ma1", "Da1", "Pa", "Ma1", "Ga2",
  "Pa", "Ma1", "Ga2", "Pa", "Ma1", "Ga2", "Ri1",
  "Ma1", "Ga2", "Ri1", "Ma1", "Ga2", "Ri1", "Sa"
];

const ALANKARAM_5_LYRICS = [
  "S R G | S R | G M ||",
  "R G M | R G | M P ||",
  "G M P | G M | P D ||",
  "M P D | M P | D N ||",
  "P D N | P D | N Ṡ ||",
  "Ṡ N D | Ṡ N | D P ||",
  "N D P | N D | P M ||",
  "D P M | D P | M G ||",
  "P M G | P M | G R ||",
  "M G R | M G | R S ||"
];

const GEETHAM_1_LYRICS = [
  "rāmachandrāya janakarājajā manōharāya\nmāmakābhīṣṭadāya mahita maṅgaḻam ||",
  "kōsalēśāya mandahāsa dāsapōṣaṇāya\nvāsavādi vinuta sadvarada maṅgaḻam || 1 ||",
  "chāru kuṅkumō pēta chandanādi charchitāya\nhārakaṭaka śōbhitāya bhūri maṅgaḻam || 2 ||",
  "lalita ratnakuṇḍalāya tulasīvanamālikāya\njalada sadruśa dēhāya chāru maṅgaḻam || 3 ||",
  "dēvakīputrāya dēva dēvōttamāya\nchāpa jāta guru varāya bhavya maṅgaḻam || 4 ||",
  "puṇḍarīkākṣāya pūrṇachandrānanāya\naṇḍajātavāhanāya atula maṅgaḻam || 5 ||",
  "vimalarūpāya vividha vēdāntavēdyāya\nsujana chitta kāmitāya śubhaga maṅgaḻam || 6 ||",
  "rāmadāsa mṛdula hṛdaya tāmarasa nivāsāya\nsvāmi bhadragirivarāya sarva maṅgaḻam || 7 ||"
];

const GEETHAM_2_LYRICS = [
  "Mudhaakaraattha Modakam… Sada Vimukthi Saadhakam\nKalaadharaavathamsakam… VilaasiLoka Rakshakam\nAnaayakaika Naayakam… Vinaashithebha Dhaithyakam\nNathashubhaashu Naashakam… Namaami Tham Vinaayakam",
  "Nathetharaathi Bheekaram… Navodhithaarka Bhaaswaram\nNamathsuraari Nirjaram… Nathaadhikaapadhuddaram\nSureshwaram Nidheeshwaram… Gajeshwaram Ganeshwaram\nMaheshwaram Thamaashraye… Paraathparam Nirantharam",
  "Samastha Loka Shankaram… Nirastha Dhaithya Kunjaram\nDharetharodharam Varam… Varebha Vakthra Maksharam\nKrupaakaram Kshamaakaram… Mudhaakaram Yashaskaram\nManaskaram Namskruthaam… Namskaromi Bhaaswaram",
  "Akinchanaarthi Maarjanam… Chirantha Nokthi Bhaajanam\nPuraari Poorva Nandhanam… Suraari Garva Charvanam\nPrapancha Naasha Bheeshanam… Dhananjayaadhi Bhooshanam\nKapola Dhaanavaranam… Bhaje Puraana Vaaranam",
  "Nithaantha Kaanthi Dhantha Kaanthi Mantha Kaanthi Kaathmajam\nAchinthya Roopamantha Heena… Mantharaaya Krunthanam\nHrudhanthare Nirantharam… Vasanthameva Yoginaam\nThamekadhantha Mevatham… Vichintha Yaami Santhatham",
  "Maha Ganesha Pancharathna… Maadharena Yonvaham\nPrjalpathi Prabhaathake… Hrudismaram Ganeshwaram\nArogathaamadhoshathaam… Susaahitheem Suputhrathaam\nSamaahithaayu Rashta Bhoothi… MabhyuPaithi Soochiraath",
  "Mudhaakaraattha Modakam… Sada Vimukthi Saadhakam\nKalaadharaavathamsakam… VilaasiLoka Rakshakam\nAnaayakaika Naayakam… Vinaashithebha Dhaithyakam\nNathashubhaashu Naashakam… Namaami Tham Vinaayakam"
];

const ANNAMAYYA_1_LYRICS = [
  "॥ palukē baṅgāramāyēnā ॥\n\npalukē baṅgāramāyēnā ॥",
  "palukē baṅgāramāyēnā kōdaṇḍapāNi\n\npalukē baṅgāramāyēnā ||",
  "palukē baṅgāramayē pilichina palukavēmi\n\nkalalō nī nāmasmaraNa maruva chakkani thaṇḍri\n\npalukē baṅgāramāyēnā ||",
  "iravūga nisukalōna pōralēna yuḍutha bhaktiki\n\nkaruNInchi brō chithivani nēranammithi ninnē thaṇḍri\n\npalukē baṅgāramāyēnā ||",
  "rāthini nāthiga jēsi bhūthalamuna pra\n\nkhyāthi jēndhithivani prīthithō nammithi thaṇḍri\n\npalukē baṅgāramāyēnā ||",
  "yēntha vēḍina gāni sunthaina dhaya rādhu\n\npanthambu sēya nēnēnthaṭi vāḍanu taṇḍri\n\npalukē baṅgāramāyēnā ||",
  "saraNāgatha thrāNa birudhāṅkithuḍavu gādha\n\nkaruNinchu bhadhrāchalavara rāmadāsa pōṣha\n\npalukē baṅgāramāyēnā ||"
];

const ANNAMAYYA_2_LYRICS = [
  "chakkani talliki chāṅgubhaḻā\ntana chakkera mōviki chāṅgubhaḻā ॥ (2.5)",
  "kulikeḍi muripepu kummarimpu tana\nsaḻupu jūpulaku chāṅgubhaḻā । (2)\npalukula sompula batitō gasareḍi\nchalamula yalukaku chāṅgubhaḻā ॥ (2)\nchakkani talliki chāṅgubhaḻā (pa..)",
  "kinneratō pati kelana niluchu tana\nchannu meRugulaku chāṅgubhaḻā । (2)\nunnati batipai noragi niluchu tana\nsannapu naḍimiki chāṅgubhaḻā ॥ (2)\nchakkani talliki chāṅgubhaḻā (pa..)",
  "jandepu mutyapu sarulahāramula\nchandana gandhiki chāṅgubhaḻā । (2)\nvindayi veṅkaṭa vibhubena chinatana\nsandi daṇḍalaku chāṅgubhaḻā ॥ (2) x\nchakkani talliki chāṅgubhaḻā (pa..)"
];

const SWARA_FREQS = {
  "LowNi3": 246.94,
  "Sa": 261.63,
  "Ri1": 277.18,
  "Ri2": 293.66,
  "Ga2": 311.13,
  "Ga3": 329.63,
  "Ma1": 349.23,
  "Ma2": 369.99,
  "Pa": 392.00,
  "Da1": 415.30,
  "Da2": 440.00,
  "Ni2": 466.16,
  "Ni3": 493.88,
  "HighSa": 523.25
};

export default function ModulePractice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSwara, setCurrentSwara] = useState('Sa');
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [pitchData, setPitchData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [isPlayingRef, setIsPlayingRef] = useState(false);
  const [playingScale, setPlayingScale] = useState(0); // 0=off, 1,2,3=speeds
  const [liveNote, setLiveNote] = useState(null); // Swara name currently sounding

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const scaleOscillatorsRef = useRef([]);
  const noteTimersRef = useRef([]); // setTimeout IDs for live note highlighting

  const stopScale = () => {
    scaleOscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    scaleOscillatorsRef.current = [];
    noteTimersRef.current.forEach(t => clearTimeout(t));
    noteTimersRef.current = [];
    setPlayingScale(0);
    setLiveNote(null);
  };

  const playScaleSequence = (speed, scaleArray = AAROHANAM_FULL) => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    stopScale(); // stop any active
    setPlayingScale(speed);

    const t = ctx.currentTime;
    
    // Support state mapping ranges 1-3, 11-13 (Exercise 1), 21-23 (Exercise 2), 31-33 (Exercise 3), 41-43 (Exercise 4), 51-53 (Exercise 5), 61-63 (Exercise 6), 71-73 (Alankaram 1), 81-83 (Alankaram 2), 91-93 (Alankaram 3), 111-113 (Alankaram 5), 121-123 (Geetham 1), 200+, 300+, 400+, 500+, 600+, 700+, 800+, 900+, 1100+, 1200+ (Line by Line)
    let actualSpeed = speed;
    if (speed >= 200) {
      actualSpeed = 1; // Default to Speed 1 for individual lines
    } else if (speed > 120) {
      actualSpeed = speed - 120;
    } else if (speed > 110) {
      actualSpeed = speed - 110;
    } else if (speed > 100) {
      actualSpeed = speed - 100;
    } else if (speed > 90) {
      actualSpeed = speed - 90;
    } else if (speed > 80) {
      actualSpeed = speed - 80;
    } else if (speed > 70) {
      actualSpeed = speed - 70;
    } else if (speed > 60) {
      actualSpeed = speed - 60;
    } else if (speed > 50) {
      actualSpeed = speed - 50;
    } else if (speed > 40) {
      actualSpeed = speed - 40;
    } else if (speed > 30) {
      actualSpeed = speed - 30;
    } else if (speed > 20) {
      actualSpeed = speed - 20;
    } else if (speed > 10) {
      actualSpeed = speed - 10;
    }
    
    // speed 1 = 1 note per second
    // speed 2 = 2 notes per second (0.5s per note)
    // speed 3 = 4 notes per second (0.25s per note)
    const beatsPerNote = actualSpeed === 1 ? 1 : actualSpeed === 2 ? 0.5 : 0.25;
    const beatDuration = 1.0; // 1 beat = 1 second
    const noteDuration = beatDuration * beatsPerNote; 
    const totalDuration = noteDuration * scaleArray.length;

    // Talam Beat Generator (Woodblock sound every beat)
    const numBeats = Math.ceil(totalDuration / beatDuration);
    for (let i = 0; i <= numBeats; i++) {
      const beatOsc = ctx.createOscillator();
      const beatGain = ctx.createGain();
      beatOsc.type = 'triangle';
      
      let isAccent = false;
      const isDhruva = (speed > 70 && speed < 80) || (speed >= 700 && speed < 800);
      const isMatya = (speed > 80 && speed < 90) || (speed >= 800 && speed < 900);
      const isRupaka = (speed > 90 && speed < 100) || (speed >= 900 && speed < 1000);
      const isTriputa = (speed > 110 && speed < 120) || (speed >= 1100 && speed < 1200);
      const isTisraEka = (speed > 120 && speed < 130) || (speed >= 1200 && speed < 1300);
      
      if (isDhruva) {
        // Dhruva Talam (14 beats): Laghu(4) + Dhrtam(2) + Laghu(4) + Laghu(4)
        isAccent = [0, 4, 6, 10].includes(i % 14);
      } else if (isMatya) {
        // Matya Talam (10 beats): Laghu(4) + Dhrtam(2) + Laghu(4)
        isAccent = [0, 4, 6].includes(i % 10);
      } else if (isRupaka) {
        // Rupaka Talam (6 beats): Dhrtam(2) + Laghu(4)
        isAccent = [0, 2].includes(i % 6);
      } else if (isTriputa) {
        // Triputa Talam (7 beats): Laghu(3) + Dhrtam(2) + Dhrtam(2)
        isAccent = [0, 3, 5].includes(i % 7);
      } else if (isTisraEka) {
        // Tisra Eka Talam (3 beats): Laghu(3)
        isAccent = i % 3 === 0;
      } else {
        // Standard Adi Talam (8 beats) equivalent
        isAccent = i === 0 || i % 4 === 0;
      }
      
      beatOsc.frequency.setValueAtTime(isAccent ? 800 : 600, t + i * beatDuration); // Accent
      beatOsc.frequency.exponentialRampToValueAtTime(100, t + i * beatDuration + 0.1);
      
      beatOsc.connect(beatGain);
      beatGain.connect(ctx.destination);
      
      beatGain.gain.setValueAtTime(0.5, t + i * beatDuration);
      beatGain.gain.exponentialRampToValueAtTime(0.01, t + i * beatDuration + 0.1);
      
      beatOsc.start(t + i * beatDuration);
      beatOsc.stop(t + i * beatDuration + 0.1);
      scaleOscillatorsRef.current.push(beatOsc);
    }

    // Main Synth
    const mainOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const mainGain = ctx.createGain();

    mainOsc.type = 'sawtooth';
    filter.type = 'lowpass';
    filter.frequency.value = 700;
    
    mainOsc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    // Dynamic Frequencies and Per-Note Envelopes
    scaleArray.forEach((swara, index) => {
      const startTime = t + (index * noteDuration);
      const isExt = swara.includes('_ext');
      const actualSwara = swara.replace('_ext', '');
      const freq = SWARA_FREQS[actualSwara] || 261.63;
      
      mainOsc.frequency.setValueAtTime(freq, startTime);
      
      // Plucked / Vocal articulation so repeating notes (Janta) are audible
      if (!isExt) {
        // Drop volume briefly before note, hit attack
        mainGain.gain.setValueAtTime(index === 0 ? 0 : 0.05, startTime);
        mainGain.gain.linearRampToValueAtTime(0.4, startTime + Math.min(noteDuration * 0.1, 0.05));
      }
      
      mainGain.gain.setValueAtTime(0.4, startTime + (noteDuration * 0.9));
      
      // Decay only if the NEXT note is NOT an extension
      const playDecay = index === scaleArray.length - 1 || !scaleArray[index + 1]?.includes('_ext');
      if (playDecay) {
        mainGain.gain.linearRampToValueAtTime(0.05, startTime + noteDuration);
      }
    });

    // Make sure it dies cleanly at the end
    mainGain.gain.linearRampToValueAtTime(0, t + totalDuration);

    mainOsc.start(t);
    mainOsc.stop(t + totalDuration);
    scaleOscillatorsRef.current.push(mainOsc);

    // ---- Live Note Highlight Scheduling ----
    noteTimersRef.current.forEach(timer => clearTimeout(timer));
    noteTimersRef.current = [];
    scaleArray.forEach((swara, index) => {
      const delayMs = Math.round(index * noteDuration * 1000);
      const timer = setTimeout(() => {
        setLiveNote(swara.replace('_ext', ''));
      }, delayMs);
      noteTimersRef.current.push(timer);
    });

    setTimeout(() => {
      setPlayingScale(0);
      setLiveNote(null);
    }, totalDuration * 1000);
  };

  const playReference = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;
    const duration = 3.0;

    // ==========================================
    // 1. Carnatic Tambura Drone (Sa - Pa - Sa)
    // ==========================================
    const baseFreq = 261.63; // Sa
    const paFreq = 392.00;   // Pa
    
    const createDrone = (f, vol) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      // Drone envelope
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.5);
      gain.gain.linearRampToValueAtTime(vol, t + duration - 0.5);
      gain.gain.linearRampToValueAtTime(0, t + duration);
      
      osc.start(t);
      osc.stop(t + duration);
    };

    // Play drone strings
    createDrone(baseFreq / 2, 0.15); // Mandra Sa
    createDrone(paFreq / 2, 0.1);   // Mandra Pa
    createDrone(baseFreq, 0.08);     // Madhya Sa

    // ==========================================
    // 2. Main Swara Note (Veena/Vocal style)
    // ==========================================
    const swaraFreq = SWARA_FREQS[currentSwara] || baseFreq;
    const mainOsc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const mainGain = ctx.createGain();

    mainOsc.type = 'sawtooth'; // Rich in harmonics
    mainOsc.frequency.value = swaraFreq;

    // Filter to make it sound warm and vocal/string-like
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(swaraFreq * 2.5, t);
    filter.Q.value = 2; // Slight resonance

    mainOsc.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);

    // Swara Envelope (Soft attack, sustain, soft release)
    mainGain.gain.setValueAtTime(0, t);
    mainGain.gain.linearRampToValueAtTime(0.4, t + 0.3); // Attack
    mainGain.gain.exponentialRampToValueAtTime(0.2, t + duration - 0.5); // Decay/Sustain
    mainGain.gain.linearRampToValueAtTime(0, t + duration); // Release

    // Add a slight vibrato (Gamaka) to make it sound Carnatic
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 5; // 5Hz vibrato
    lfoGain.gain.value = 3; // Pitch variation depth
    
    lfo.connect(lfoGain);
    lfoGain.connect(mainOsc.frequency);
    lfo.start(t + 0.5); // Delay vibrato slightly
    lfo.stop(t + duration);

    mainOsc.start(t);
    mainOsc.stop(t + duration);

    setIsPlayingRef(true);
    setTimeout(() => setIsPlayingRef(false), duration * 1000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzePitch(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setFeedback(null);
      setPitchData(null);
    } catch (err) {
      alert("Microphone access needed for pitch matching!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setAnalyzing(true);
    }
  };

  const analyzePitch = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'record.webm');
    formData.append('target', currentSwara);

    try {
      const res = await axios.post(`${API_BASE}/api/analyze-pitch`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setPitchData(res.data);
        setFeedback({ msg: res.data.feedback, correct: res.data.is_correct });
      }
    } catch (err) {
      setFeedback({ msg: 'Failed to analyze pitch.', correct: false });
    } finally {
      setAnalyzing(false);
    }
  };

  const unlockNext = async () => {
    try {
      const username = localStorage.getItem('username');
      const nextMap = { 'swaras': 'basic_notes', 'basic_notes': 'alankaras', 'alankaras': 'geethams', 'geethams': 'annamacharya' };
      const nextMod = nextMap[id];
      if (nextMod) {
        await axios.post(`${API_BASE}/api/progress/${username}/unlock`, { module: nextMod });
        setFeedback({ msg: 'Module unlocked! Returning to dashboard...', correct: true });
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        setFeedback({ msg: 'You have completed this module entirely.', correct: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container fade-in">
      <div className="glass" style={{ padding: '2rem', marginTop: '2rem' }}>
        <button className="btn btn-secondary mb-4" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="text-center mb-4">
          <h2>Practice: <span className="gradient-text">{id.replace('_', ' ').toUpperCase()}</span></h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Select a Swara and match your pitch.</p>
        </div>

        <div className="visual-guide flex-center flex-wrap" style={{ gap: '1rem', padding: '1rem 0' }}>
          {["Sa", "Ri", "Ga", "Ma", "Pa", "Da", "Ni"].map((swara) => {
            const isActive = currentSwara.startsWith(swara);
            const isLive = liveNote && liveNote.startsWith(swara);
            return (
              <div
                key={swara}
                className={`swara-bubble ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentSwara(swara === 'Sa' || swara === 'Pa' ? swara : swara + '1')}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  ...(isLive && !isActive ? {
                    background: 'rgba(255, 143, 0, 0.3)',
                    border: '2px solid var(--accent-secondary)',
                    color: 'white',
                    transform: 'scale(1.2)',
                    boxShadow: '0 0 22px rgba(255, 143, 0, 0.8)',
                  } : {}),
                  ...(isActive && isLive ? {
                    boxShadow: '0 0 30px rgba(255, 215, 0, 1)',
                    transform: 'scale(1.35)',
                  } : {}),
                }}
              >
                {swara}
              </div>
            );
          })}
        </div>

        {/* ===== LIVE NOTE DISPLAY ===== */}
        <div style={{ textAlign: 'center', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.25rem 0 0.5rem' }}>
          {liveNote ? (
            <div key={liveNote} style={{
              display: 'inline-flex', alignItems: 'center', gap: '1rem',
              background: 'rgba(255, 215, 0, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.45)',
              borderRadius: '50px',
              padding: '0.5rem 2rem',
              animation: 'notePop 0.18s ease-out',
              boxShadow: '0 0 24px rgba(255, 215, 0, 0.25)',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif', letterSpacing: '2px' }}>♪ NOW</span>
              <span style={{
                fontSize: '2rem', fontFamily: 'Cinzel, serif', fontWeight: 800,
                color: 'var(--accent-tertiary)',
                textShadow: '0 0 16px rgba(255,215,0,0.7)',
              }}>
                {liveNote === 'HighSa' ? 'Ṡ' :
                  liveNote.replace(/1$/, '₁').replace(/2$/, '₂').replace(/3$/, '₃')}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'Cinzel, serif', letterSpacing: '2px' }}>♪</span>
            </div>
          ) : (
            playingScale > 0
              ? <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontStyle: 'italic' }}>Starting...</span>
              : null
          )}
        </div>

        {/* Practice Control Area */}
        <div className="practice-area glass" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <div className="flex-center mb-2">
             <AudioLines size={64} style={{ color: isRecording ? 'var(--error)' : 'var(--accent-secondary)', animation: isRecording ? 'pulse 1s infinite' : 'none' }} />
          </div>
          
          <h3 className="mb-2">Target Swara: <span className="gradient-text" style={{ fontSize: '2rem' }}>{currentSwara}</span></h3>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Click record and sing the Swara clearly into your microphone.</p>

          <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={playReference} disabled={isPlayingRef || isRecording || analyzing || playingScale > 0}>
              <Volume2 size={20} /> {isPlayingRef ? 'Playing...' : 'Play Reference'}
            </button>
            {!isRecording ? (
              <button className="btn btn-action" onClick={startRecording} disabled={analyzing || playingScale > 0}>
                {analyzing ? <RefreshCw size={20} className="spin" /> : <Mic size={20} />} 
                {analyzing ? 'Analyzing...' : 'Start Recording'}
              </button>
            ) : (
              <button className="btn btn-danger" onClick={stopRecording}>
                <Square size={20} /> Stop Recording
              </button>
            )}
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--accent-secondary)' }}>Sarali Swaralu (Full Scale 3 Speeds)</h4>
            <div className="flex-center flex-wrap" style={{ gap: '0.5rem' }}>
              {[1, 2, 3].map(speed => (
                <button 
                  key={speed} 
                  className={`btn ${playingScale === speed ? 'btn-danger' : 'btn-secondary'}`} 
                  onClick={() => playingScale === speed ? stopScale() : playScaleSequence(speed, AAROHANAM_FULL)}
                  disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed)}
                  style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                >
                  {playingScale === speed ? <Square size={16} /> : <FastForward size={16} />}
                  Speed {speed}
                </button>
              ))}
            </div>
          </div>

          {id === 'basic_notes' && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-tertiary)' }}>Janta Swaralu (Double Notes)</h4>
              <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Record while these references play to practice overlapping your breath and timing!</p>
              
              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 1 (Basic)</h5>
              <div className="flex-center flex-wrap" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 10 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 10 ? stopScale() : playScaleSequence(speed + 10, JANTA_SWARALU)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 10)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 10 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed} {speed === 1 ? '(1x)' : speed === 2 ? '(2x)' : '(4x)'}
                  </button>
                ))}
              </div>

              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 2 (Stepped)</h5>
              
              <div style={{ marginBottom: '1.5rem' }}>
                {JANTA_2_LYRICS.map((line, idx) => {
                  const lineSlice = JANTA_SWARALU_2.slice(idx * 8, idx * 8 + 8);
                  const isLinePlaying = playingScale === 200 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(200 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
                <div className="flex-center flex-wrap" style={{ gap: '0.5rem', marginTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 2:</span>
                  {[1, 2, 3].map(speed => (
                    <button 
                      key={speed} 
                      className={`btn ${playingScale === speed + 20 ? 'btn-danger' : 'btn-secondary'}`} 
                      onClick={() => playingScale === speed + 20 ? stopScale() : playScaleSequence(speed + 20, JANTA_SWARALU_2)}
                      disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 20)}
                      style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    >
                      {playingScale === speed + 20 ? <Square size={16} /> : <FastForward size={16} />}
                      Speed {speed}
                    </button>
                  ))}
                </div>
              </div>

              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 3 (Zig-Zag)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {JANTA_3_LYRICS.map((line, idx) => {
                  const lineSlice = JANTA_SWARALU_3.slice(idx * 16, idx * 16 + 16);
                  const isLinePlaying = playingScale === 300 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(300 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center flex-wrap" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 3:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 30 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 30 ? stopScale() : playScaleSequence(speed + 30, JANTA_SWARALU_3)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 30)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 30 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>

              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 4 (Zig-Zag Reversals)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {JANTA_4_LYRICS.map((line, idx) => {
                  const lineSlice = JANTA_SWARALU_4.slice(idx * 16, idx * 16 + 16);
                  const isLinePlaying = playingScale === 400 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(400 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center flex-wrap" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 4:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 40 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 40 ? stopScale() : playScaleSequence(speed + 40, JANTA_SWARALU_4)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 40)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 40 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>

              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 5 (Sustained Janta)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {JANTA_5_LYRICS.map((line, idx) => {
                  const lineSlice = JANTA_SWARALU_5.slice(idx * 16, idx * 16 + 16);
                  const isLinePlaying = playingScale === 500 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(500 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center flex-wrap" style={{ gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 5:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 50 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 50 ? stopScale() : playScaleSequence(speed + 50, JANTA_SWARALU_5)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 50)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 50 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>

              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 6 (Middle Sustain Janta)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {JANTA_6_LYRICS.map((line, idx) => {
                  const lineSlice = JANTA_SWARALU_6.slice(idx * 16, idx * 16 + 16);
                  const isLinePlaying = playingScale === 600 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(600 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center flex-wrap" style={{ gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 6:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 60 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 60 ? stopScale() : playScaleSequence(speed + 60, JANTA_SWARALU_6)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 60)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 60 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>
            </div>
          )}

          {id === 'alankaras' && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-tertiary)' }}>Alankaralu (Talam Exercises)</h4>
              <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chaturasra Jāti Dhruva Tāḻam (14 Beats)</p>
              
              <h5 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 1 (Dhruva Talam)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {ALANKARAM_1_LYRICS.map((line, idx) => {
                  const lineSlice = ALANKARAM_1_SWARALU.slice(idx * 14, idx * 14 + 14);
                  const isLinePlaying = playingScale === 700 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(700 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

               <div className="flex-center flex-wrap" style={{ gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 1:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 70 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 70 ? stopScale() : playScaleSequence(speed + 70, ALANKARAM_1_SWARALU)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 70)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 70 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>

              <h5 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 2 (Chaturasra Jāti Maṭya Tāḻam - 10 Beats)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {ALANKARAM_2_LYRICS.map((line, idx) => {
                  const lineSlice = ALANKARAM_2_SWARALU.slice(idx * 10, idx * 10 + 10);
                  const isLinePlaying = playingScale === 800 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(800 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center flex-wrap" style={{ gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 2:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 80 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 80 ? stopScale() : playScaleSequence(speed + 80, ALANKARAM_2_SWARALU)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 80)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 80 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>

              <h5 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 3 (Chaturasra Jāti Rūpaka Tāḻam - 6 Beats)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {ALANKARAM_3_LYRICS.map((line, idx) => {
                  const lineSlice = ALANKARAM_3_SWARALU.slice(idx * 6, idx * 6 + 6);
                  const isLinePlaying = playingScale === 900 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(900 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center flex-wrap" style={{ gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 3:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 90 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 90 ? stopScale() : playScaleSequence(speed + 90, ALANKARAM_3_SWARALU)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 90)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 90 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>

              <h5 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Exercise 5 (Tisra Jāti Tripuṭa Tāḻam - 7 Beats)</h5>
              
              <div style={{ marginBottom: '1rem' }}>
                {ALANKARAM_5_LYRICS.map((line, idx) => {
                  const lineSlice = ALANKARAM_5_SWARALU.slice(idx * 7, idx * 7 + 7);
                  const isLinePlaying = playingScale === 1100 + idx;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      <span>{line}</span>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => isLinePlaying ? stopScale() : playScaleSequence(1100 + idx, lineSlice)}
                        disabled={isPlayingRef || (playingScale > 0 && !isLinePlaying)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {isLinePlaying ? <Square size={14} /> : <Play size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex-center flex-wrap" style={{ gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Play Full Exercise 5:</span>
                {[1, 2, 3].map(speed => (
                  <button 
                    key={speed} 
                    className={`btn ${playingScale === speed + 110 ? 'btn-danger' : 'btn-secondary'}`} 
                    onClick={() => playingScale === speed + 110 ? stopScale() : playScaleSequence(speed + 110, ALANKARAM_5_SWARALU)}
                    disabled={isPlayingRef || (playingScale > 0 && playingScale !== speed + 110)}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    {playingScale === speed + 110 ? <Square size={16} /> : <FastForward size={16} />}
                    Speed {speed}
                  </button>
                ))}
              </div>
            </div>
          )}

          {id === 'geethams' && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-tertiary)' }}>Geethams (Core Carnatic Compositions)</h4>
              <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Sri Ramachandraya Janaka Mangalam (Kurinji/Navaroj) - Tisra Eka Talam</p>
              
              <div style={{ margin: '1.5rem 0', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe 
                  width="100%" 
                  height="315" 
                  src="https://www.youtube.com/embed/bunD6Pl65gA" 
                  title="Professional Carnatic Singer Voice" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ borderRadius: '12px' }}
                ></iframe>
                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Listen to a professional Carnatic vocalist sing the exact phrasing and lyrics!</p>
              </div>

              <h5 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Song 1: Full Geetham Lyrics</h5>
              
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                {GEETHAM_1_LYRICS.map((line, idx) => {
                  let stzText = "";
                  if (idx === 0) stzText = "Pallavi";
                  else if (idx === 1) stzText = "Charanam 1";
                  else if (idx === 2) stzText = "Charanam 2";
                  else if (idx === 3) stzText = "Charanam 3";
                  else if (idx === 4) stzText = "Charanam 4";
                  else if (idx === 5) stzText = "Charanam 5";
                  else if (idx === 6) stzText = "Charanam 6";
                  else if (idx === 7) stzText = "Charanam 7";

                  return (
                    <React.Fragment key={idx}>
                      {stzText && <h6 style={{ color: 'var(--accent-secondary)', marginTop: idx === 0 ? '0' : '1.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{stzText}</h6>}
                      <div style={{ fontFamily: 'sans-serif', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        <span style={{ whiteSpace: 'pre-wrap' }}>{line}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '3rem 0 2rem 0' }}></div>

              <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Maha Ganesha Pancharatnam (Adi Shankaracharya) - Ragamalika</p>
              
              <div style={{ margin: '1.5rem 0', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe 
                  width="100%" 
                  height="315" 
                  src="https://www.youtube.com/embed/guZR2_MS5ec" 
                  title="Maha Ganesha Pancharatnam Voice" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ borderRadius: '12px' }}
                ></iframe>
                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Listen to the legendary MS Subbulakshmi sing the Pancharatnam!</p>
              </div>

              <h5 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Song 2: Full Geetham Lyrics</h5>
              
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                {GEETHAM_2_LYRICS.map((line, idx) => {
                  let stzText = "";
                  if (idx === 0) stzText = "Stanza 1 (Mudhaakaraattha)";
                  else if (idx === 1) stzText = "Stanza 2 (Nathetharaathi)";
                  else if (idx === 2) stzText = "Stanza 3 (Samastha Loka)";
                  else if (idx === 3) stzText = "Stanza 4 (Akinchanaarthi)";
                  else if (idx === 4) stzText = "Stanza 5 (Nithaantha Kaanthi)";
                  else if (idx === 5) stzText = "Phala Sruti (Maha Ganesha)";
                  else if (idx === 6) stzText = "Stanza 1 Repeat";

                  return (
                    <React.Fragment key={idx}>
                      {stzText && <h6 style={{ color: 'var(--accent-secondary)', marginTop: idx === 0 ? '0' : '1.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{stzText}</h6>}
                      <div style={{ fontFamily: 'sans-serif', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        <span style={{ whiteSpace: 'pre-wrap' }}>{line}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {id === 'annamacharya' && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ marginBottom: '1rem', color: 'var(--accent-tertiary)' }}>Annamacharya Keerthanas</h4>
              <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paluke Bangaramayera - Anandabhairavi Ragam</p>
              
              <div style={{ margin: '1.5rem 0', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe 
                  width="100%" 
                  height="315" 
                  src="https://www.youtube.com/embed/MkwL226LKyc" 
                  title="Paluke Bangaramayera Voice" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ borderRadius: '12px' }}
                ></iframe>
                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Listen to the professional Carnatic rendition of this classical masterpiece!</p>
              </div>

              <h5 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Full Keerthana Lyrics</h5>
              
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                {ANNAMAYYA_1_LYRICS.map((line, idx) => {
                  let stzText = "";
                  if (idx === 0) stzText = "Pallavi";
                  else if (idx === 1) stzText = "Anupallavi";
                  else if (idx === 2) stzText = "Charanam 1";
                  else if (idx === 3) stzText = "Charanam 2";
                  else if (idx === 4) stzText = "Charanam 3";
                  else if (idx === 5) stzText = "Charanam 4";
                  else if (idx === 6) stzText = "Charanam 5";

                  return (
                    <React.Fragment key={idx}>
                      {stzText && <h6 style={{ color: 'var(--accent-secondary)', marginTop: idx === 0 ? '0' : '1.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{stzText}</h6>}
                      <div style={{ fontFamily: 'sans-serif', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        <span style={{ whiteSpace: 'pre-wrap' }}>{line}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
              
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '3rem 0 2rem 0' }}></div>

              <p className="mb-2" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chakkani Talliki Changu Bhala - Annamayya Keerthana</p>
              
              <div style={{ margin: '1.5rem 0', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe 
                  width="100%" 
                  height="315" 
                  src="https://www.youtube.com/embed/co98ZEbv00A" 
                  title="Chakkani Talliki Voice" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  style={{ borderRadius: '12px' }}
                ></iframe>
                <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Listen to an authentic rendering of Chakkani Talliki Changu Bhala!</p>
              </div>

              <h5 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Full Keerthana Lyrics</h5>
              
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                {ANNAMAYYA_2_LYRICS.map((line, idx) => {
                  let stzText = "";
                  if (idx === 0) stzText = "Pallavi";
                  else if (idx === 1) stzText = "Charanam 1";
                  else if (idx === 2) stzText = "Charanam 2";
                  else if (idx === 3) stzText = "Charanam 3";

                  return (
                    <React.Fragment key={idx}>
                      {stzText && <h6 style={{ color: 'var(--accent-secondary)', marginTop: idx === 0 ? '0' : '1.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{stzText}</h6>}
                      <div style={{ fontFamily: 'sans-serif', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.6', marginBottom: '0.5rem' }}>
                        <span style={{ whiteSpace: 'pre-wrap' }}>{line}</span>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem', borderTop: '1px solid rgba(255, 215, 0, 0.1)' }}>
             <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontFamily: 'Cinzel, serif' }}>Module Mastery</h3>
             <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>If you have fully mastered this milestone's practices, you may unlock the next path.</p>
             <button className="btn btn-action" onClick={unlockNext} style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', borderRadius: '50px' }}>
                Complete & Unlock Next Module
             </button>
          </div>

          {feedback && (
            <div className={`glass mt-4 p-3 fade-in`} style={{ padding: '1.5rem', background: feedback.correct ? 'rgba(158, 206, 106, 0.1)' : 'rgba(26, 27, 38, 0.8)', border: `1px solid ${feedback.correct ? 'var(--success)' : 'var(--accent-tertiary)'}` }}>
              <h4>{feedback.msg}</h4>
              {pitchData && (
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Target: {pitchData.target.toFixed(1)} Hz | Detected: {pitchData.pitch.toFixed(1)} Hz
                </div>
              )}
              {feedback.correct && (
                <button className="btn btn-secondary mt-3" onClick={unlockNext}>
                  <Award size={20} color="var(--accent-color)" /> Unlock Next Module
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes notePop {
          0%   { transform: scale(0.85); opacity: 0; }
          60%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1);    opacity: 1; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
