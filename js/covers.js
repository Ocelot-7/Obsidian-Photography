// Photos choisies à la main par Thomas (identifiants Cloudinary, comme dans photos.js).
// Fichier écrit par la page admin.html — on peut aussi le modifier à la main.
// Tant qu'une liste est vide ou absente, le site tire au hasard.
//   home      : diaporama plein écran de l'accueil, dans cet ordre
//   selection : photos de la section « Selection » de l'accueil, dans cet ordre
//   series    : couvertures par série (l'aperçu de la série en tire une au hasard)
//   hidden    : photos masquées, par série (elles restent dans photos.js)

const COVERS = {
  "home": [
    "IMGL6361-2_impjst",
    "633A5834_qxhjbb",
    "IMGL6401_t0sgu3",
    "IMGL6308_m3wdzf",
    "v1767280805/IMGL1205_ekhgm3.jpg",
    "633A2876-2_ijjdyz",
    "IMGL0323_n4nfkw",
    "IMGL0058-2_fs8vii",
    "IMGL7139-2_evavfp",
    "633A2678_gdmuxc",
    "633A2332_tieznu"
  ],
  "selection": [
    "v1767280805/IMGL1205_ekhgm3.jpg",
    "633A2655_rjyv6d",
    "633A2647_da8bf9",
    "633A2876-2_ijjdyz",
    "IMGL9507-2_v7b1qi",
    "IMGL9125_xi2v8p",
    "IMGL6308_m3wdzf",
    "633A5935-2_r1itex",
    "633A5350_mnpc5c",
    "IMGL7076_bvbf8d",
    "IMGL6401_t0sgu3",
    "building_with_circular_tower",
    "tsutenkaku_dusk",
    "modern_skyscraper_day",
    "osaka_food_signs_vintage",
    "osaka_ferris_wheel_sunset_2",
    "tokyo_shrine_street",
    "633A4201-2_ccpn6k",
    "IMGL6869_loq8ks",
    "IMGL2289-3_yqhrcf",
    "IMGL6486_nm9ria",
    "633A4107_uu4baf",
    "IMGL6734_hcar2g",
    "IMGL0135_n59qbt",
    "IMGL6503-5_idx04h",
    "IMGL7721_ngwgda",
    "IMGL7803-2_tchn2m",
    "IMGL7735_ktld6j",
    "633A4645_p2vyfe",
    "633A4773_koghen",
    "IMGL6576-2_zbyfji",
    "IMGL7720_zhmoz1",
    "IMGL0717_rz16j9",
    "IMGL0058-2_fs8vii",
    "IMGL0222_evahkk",
    "IMGL0720_p9tm35",
    "IMGL0899-2_aukoso",
    "IMGL0173-2_krrrqt",
    "IMGL0058_f7wsy8",
    "IMGL7792-2_eycgbc",
    "633A4056_b6qkuo",
    "multi_tiered_pagoda_bw",
    "dragon_statues_shrine",
    "633A9668_dkksrt",
    "633A8154_ggv7bg",
    "633A8255_fqbvfv",
    "IMGL1805_ylvhnc",
    "IMGL0323_n4nfkw",
    "IMGL1788-2_vgddv1",
    "IMGL1574-3_v9zama",
    "IMGL5907_enbs3m",
    "IMGL1615_xmmjsw",
    "IMGL1809_edjx8h",
    "IMGL2022_tpky3d",
    "IMGL6734-2_yjuhti",
    "633A8526_hhzmsl",
    "IMGL0084_ttuta6",
    "mountain_temple_silhouette",
    "chureito_pagoda_mountain_fuji",
    "kiyomizu_dera_pagoda_black_white",
    "dragon_statue_details",
    "ancient_temple_dragon",
    "great_buddha_kamakura_2",
    "IMGL7139-2_evavfp",
    "IMGL1050_wtdpdc",
    "IMGL4558-2_otc0nt",
    "temple_statue_dusk",
    "kamakura_buddha_bw",
    "pagoda_red_sky",
    "kiyomizu_dera_pagoda_winter",
    "japanese_pagoda_evening",
    "IMGL8169-2_hnin0q",
    "torii_gate_twilight",
    "IMGL3061_qwqvlh",
    "IMGL2981_cq2una",
    "kiyomizu_dera_pagoda_7",
    "IMGL8089_oefz9i",
    "IMGL2942-4_yp62kf",
    "IMGL3056_rj8gsi",
    "IMGL3231_mradbm",
    "traditional_temple_bright_sky",
    "japanese_pavilion_red",
    "633A0337_lzgtym",
    "633A0381-2_ojc6ke",
    "633A6188_fc5h7j",
    "IMGL7034-4_axplpr",
    "633A7185_mgt0x5",
    "633A8117_kwymyf",
    "633A8066_slrnfe",
    "633A5572_iptyzp",
    "633A2812_g3fo2u",
    "633A9350-2",
    "633A5527",
    "633A9350",
    "633A8883",
    "633A2772",
    "633A8117-2",
    "633A2755",
    "633A5416",
    "633A9388",
    "633A4939",
    "633A5561",
    "633A5553-2",
    "633A5417",
    "633A5629",
    "633A8864",
    "633A2754",
    "IMGL6315",
    "633A8875",
    "633A2803-2",
    "633A5467"
  ],
  "series": {
    "nippon": [
      "633A6188_fc5h7j",
      "633A5935-2_r1itex",
      "633A2876-2_ijjdyz",
      "IMGL6401_t0sgu3",
      "IMGL8016_abso7v",
      "633A5350_mnpc5c",
      "IMGL6361_o04q0l"
    ],
    "animals": [
      "IMGL0323_n4nfkw",
      "IMGL7721_ngwgda",
      "IMGL7803-2_tchn2m",
      "IMGL0904_qcfgko",
      "IMGL0720_p9tm35"
    ],
    "orange": [
      "lighthouse_twilight",
      "japanese_pavilion_red",
      "torii_gate_twilight",
      "kiyomizu_dera_pagoda_2"
    ],
    "city": [
      "monorail_track_elevated",
      "street_art_mural_fish_flowers",
      "building_with_circular_tower",
      "tsutenkaku_dusk",
      "tsutenkaku_dusk_view",
      "osaka_ferris_wheel_sunset_2",
      "osaka_namba_octopus_2"
    ],
    "blackwhite": [
      "v1767280805/IMGL1205_ekhgm3.jpg",
      "osaka_castle_moat",
      "sensoji_temple_day",
      "mountain_temple_silhouette",
      "chureito_pagoda_mountain_fuji",
      "IMGL2022_tpky3d",
      "633A8154_ggv7bg",
      "IMGL6734-2_yjuhti"
    ],
    "bynight": [
      "kyoto_night_lanterns",
      "giant_gundam_statue",
      "kyoto_tower_night_2",
      "illuminated_building_night",
      "japanese_neon_signs_night",
      "IMGL6302-2_owzop7"
    ],
    "people": [
      "IMGL1976_dpmdj0",
      "IMGL1717_olhddz",
      "IMGL2031_vstfhy"
    ],
    "buddha": [
      "IMGL4558-2_otc0nt",
      "IMGL7139-2_evavfp",
      "IMGL1050_wtdpdc"
    ],
    "drawings": [
      "IMG_6974_kbmdgm",
      "IMG_6986_qvqsra",
      "IMG_6956_wf7x7t",
      "IMG_6950_noes5e",
      "IMG_6982_gzfvoq"
    ],
    "rouge": [
      "IMGL9290_qkl7ms",
      "633A6188_fc5h7j",
      "IMGL7076_bvbf8d",
      "633A5350_mnpc5c"
    ],
    "bleu": [
      "633A2581_tkrkwh",
      "633A2540_x5ybgf",
      "633A7171_phsgma",
      "633A2633_nmlayg"
    ],
    "jaune": [
      "IMGL7142_lchheg",
      "IMGL0600_brdbbl",
      "IMGL7139_jdirjl",
      "633A8955_hiefub",
      "633A8544_mwwa8n",
      "IMGL7145_ra40lh"
    ],
    "vert": [
      "633A9341-3",
      "633A8117-3",
      "633A8893",
      "633A8875-3",
      "633A8875-2_zzr88o",
      "633A8066_slrnfe",
      "633A5527",
      "633A2812_g3fo2u"
    ]
  },
  "hidden": {
    "orange": [
      "kiyomizu_dera_pagoda_11",
      "IMGL2942-4_yp62kf",
      "japanese_pagoda_evening",
      "kiyomizu_dera_pagoda_6",
      "IMGL3061_qwqvlh",
      "kiyomizu_dera_pagoda_4"
    ],
    "nippon": [
      "IMGL6361-2_impjst",
      "IMGL6308_m3wdzf",
      "IMGL7085-2_vslaft"
    ],
    "bynight": [
      "neon_lights_street",
      "osaka_neon_sign"
    ]
  }
};
