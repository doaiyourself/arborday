// 결혼식 정보 — 이 파일만 수정하면 전체 청첩장에 반영됩니다
window.WEDDING = {
  // 결혼식 일시 (한국시간)
  date: '2026-08-09T11:00:00+09:00',
  dateLabel: '2026년 8월 9일 일요일',
  timeLabel: '오전 11시',

  // 신랑
  groom: {
    name: '정철환',
    nameEn: 'Chulhwan',
    phone: '010-0000-0000',
    relation: '장남',
    father: { name: '정성국', deceased: true, phone: '' },
    mother: { name: '신미정', deceased: false, phone: '010-0000-0000' },
    accounts: [
      { holder: '정철환', bank: '국민', number: '000-00-0000-000' },
      { holder: '신미정 (어머니)', bank: '국민', number: '000-00-0000-000' }
    ]
  },

  // 신부
  bride: {
    name: '이재선',
    nameEn: 'Jaesun',
    phone: '010-0000-0000',
    relation: '장녀',
    father: { name: '이찬희', deceased: false, phone: '010-0000-0000' },
    mother: { name: '전지우', deceased: false, phone: '010-0000-0000' },
    accounts: [
      { holder: '이재선', bank: '신한', number: '000-000-000000' },
      { holder: '이찬희 (아버지)', bank: '신한', number: '000-000-000000' },
      { holder: '전지우 (어머니)', bank: '신한', number: '000-000-000000' }
    ]
  },

  // 식장
  venue: {
    name: '아펠가모 선릉',
    floor: '4층',
    address: '서울 강남구 테헤란로 322',
    addressDetail: '한신인터밸리24 빌딩 4층',
    tel: '02-2055-7100',
    // 한신인터밸리24 빌딩 정확한 좌표 (네이버 지도 기준)
    lat: 37.5046,
    lng: 127.0492
  },

  // 갤러리 이미지 — assets/images/gallery/ 폴더
  gallery: [
    'assets/images/gallery/01.png',
    'assets/images/gallery/02.jpeg',
    'assets/images/gallery/03.jpeg',
    'assets/images/gallery/04.png',
    'assets/images/gallery/05.png',
    'assets/images/gallery/06.png',
    'assets/images/gallery/11.jpeg',
    'assets/images/gallery/12.jpeg',
    'assets/images/gallery/13.jpeg',
    'assets/images/gallery/14.png',
    'assets/images/gallery/21.jpeg',
    'assets/images/gallery/31.jpg',
    'assets/images/gallery/32.jpg',
    'assets/images/gallery/33.jpg',
    'assets/images/gallery/34.jpg',
    'assets/images/gallery/51.jpg',
    'assets/images/gallery/52.jpg',
    'assets/images/gallery/61.jpg',
    'assets/images/gallery/62.png'
  ],

  // 히어로 이미지 — assets/images/hero/ 폴더에 01.jpg, 02.jpg ... 식으로 넣기
  // 여러 장 넣으면 자동으로 페이드 슬라이드쇼로 돌아감 (한 장만 있으면 정적)
  heroImages: [
    'assets/images/hero/01.jpg'
    // 'assets/images/hero/02.jpg',
    // 'assets/images/hero/03.jpg',
  ],

  // 잠금화면 배경 — assets/images/lock-bg/ 폴더의 01.png 사용
  lockBg: 'assets/images/lock-bg/01.png',

  // 인사말
  intro: {
    title: 'TO. our dearest',
    body: [
      '서로 다른 길을 걷고 있던 두 사람이,',
      '이제는 같은 길을 걸으려 합니다.',
      '',
      '운명처럼 마주한 저희,',
      '그렇게 맞잡은 두 손을 축복해 주세요.'
    ]
  },

  // 초대 본문
  invitation: [
    '처음엔',
    '같은 공간에서',
    '서로 다른 생각을 하는 사람인 줄 알았습니다.',
    '',
    '하지만 함께하는 시간이 쌓일수록',
    '좋아하는 것이 같았고',
    '바라보는 곳이 같았습니다.',
    '',
    '이것이 운명이 아니면',
    '무엇을 운명이라 부를까,',
    '그렇게 두 손을 맞잡으려 합니다.',
    '',
    '저희의 시작을',
    '함께 축하해 주세요.'
  ]
};
