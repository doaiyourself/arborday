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
    // 한신인터밸리24 빌딩 좌표
    lat: 37.5046,
    lng: 127.0492
  },

  // 갤러리 이미지 (Unsplash 임시, 추후 실제 스냅 사진으로 교체)
  gallery: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&q=80',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
    'https://images.unsplash.com/photo-1525258946800-98cfd641d0de?w=800&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80',
    'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?w=800&q=80'
  ],

  // 메인 히어로 이미지 (푸른 하늘 + 부케)
  heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85',

  // 인사말
  intro: {
    title: 'TO. our dearest',
    body: [
      '저희 두 사람,',
      '긴 시간을 돌아 서로를 알아보았습니다.',
      '',
      '그 마음을 약속하는 자리에',
      '귀한 걸음 부탁드립니다.'
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
