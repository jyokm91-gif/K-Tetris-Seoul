# 📸🎵 미디어 파일 설정 가이드

Seoul Tetris에 한국적 분위기를 더하기 위한 배경 이미지와 음악 파일 설정 가이드입니다.

## 🏯 배경 이미지 (경복궁)

### 필요한 파일
```
public/images/gyeongbokgung.jpg
```

### 추천 무료 이미지 사이트

1. **Unsplash** (가장 추천) ⭐
   - 링크: https://unsplash.com/s/photos/gyeongbokgung
   - 검색어: "Gyeongbokgung", "Korean palace", "Seoul"
   - 고품질, 무료, 크레딧 불필요

2. **Pexels**
   - 링크: https://www.pexels.com/search/korean%20palace/
   - 검색어: "Korean palace", "Gyeongbokgung"

3. **Pixabay**
   - 링크: https://pixabay.com/images/search/gyeongbokgung/
   - 검색어: "경복궁", "Korean architecture"

### 이미지 사양
- **형식**: JPG 또는 PNG
- **최소 해상도**: 1920 x 1080px (Full HD)
- **권장 해상도**: 2560 x 1440px 또는 그 이상
- **파일 크기**: 500KB - 2MB (웹 최적화)
- **비율**: 16:9 가로 비율

### 추천 이미지 스타일
- ✅ 경복궁 근정전 정면
- ✅ 단청(Dancheong) 색상이 선명한 사진
- ✅ 밤 또는 저녁 시간대 (게임 분위기와 어울림)
- ✅ 조명이 잘 설정된 사진
- ❌ 사람이 많이 나오는 사진
- ❌ 낮 시간대 밝은 사진 (대비가 약함)

### 다운로드 방법
1. 위 사이트 중 하나 방문
2. "Gyeongbokgung" 또는 "Korean palace" 검색
3. 마음에 드는 고해상도 이미지 다운로드
4. 파일명을 `gyeongbokgung.jpg`로 변경
5. `public/images/` 폴더에 저장

---

## 🎵 배경 음악 (국악)

### 필요한 파일
```
public/music/korean-traditional.mp3
```

### 추천 무료 음악 사이트

1. **YouTube Audio Library** (가장 추천) ⭐
   - 링크: https://studio.youtube.com (로그인 필요)
   - Music → Audio Library → Genre: "World" 또는 검색
   - 무료, 상업적 사용 가능

2. **Pixabay Music**
   - 링크: https://pixabay.com/music/
   - 검색어: "Korean", "Asian traditional", "Gayageum"

3. **Free Music Archive**
   - 링크: https://freemusicarchive.org
   - 검색어: "Korean traditional", "Asian instrumental"

4. **Incompetech**
   - 링크: https://incompetech.com/music/royalty-free/music.html
   - Category: "World" → "Asian"

### 음악 사양
- **형식**: MP3
- **비트레이트**: 128-192 kbps (웹 최적화)
- **길이**: 2-5분 (자동 루프됨)
- **스타일**: 조용하고 차분한 국악 (게임 방해 X)

### 추천 악기/스타일
- 🎵 가야금 (Gayageum) - 가장 추천
- 🎵 대금 (Daegeum) - 대나무 플루트
- 🎵 아쟁 (Ajaeng) - 현악기
- 🎵 국악 관현악 - 은은한 배경음
- ⚠️ 사물놀이 - 너무 시끄러울 수 있음

### 다운로드 방법
1. 위 사이트에서 한국 전통 음악 검색
2. 차분하고 반복적인 곡 선택 (게임 집중도 고려)
3. MP3 형식으로 다운로드
4. 파일명을 `korean-traditional.mp3`로 변경
5. `public/music/` 폴더에 저장

---

## 📝 라이선스 확인 체크리스트

미디어 파일 사용 전 반드시 확인:

### 이미지
- [ ] 무료 사용 가능한가?
- [ ] 상업적 사용 허용되는가?
- [ ] 크레딧 표기가 필요한가?
- [ ] 수정/편집이 가능한가?

### 음악
- [ ] 무료 사용 가능한가?
- [ ] 상업적 사용 허용되는가?
- [ ] 저작권 표기가 필요한가?
- [ ] YouTube/게임에 사용 가능한가?

---

## 🚀 파일 없이도 작동

**중요**: 이미지와 음악 파일이 없어도 게임은 정상 작동합니다!

- **이미지 없음**: 그라디언트 배경 + SVG 한국 전통 문양 표시
- **음악 없음**: 음악 플레이어가 자동으로 비활성화됨

---

## 🎨 최적화 팁

### 이미지 압축
파일이 너무 크면 (2MB 이상):
- https://tinypng.com - 손실 없는 압축
- https://squoosh.app - 고급 압축 옵션
- https://compressor.io - 간단한 압축

### 음악 압축
- Audacity (무료): MP3 비트레이트 조정
- Online Audio Converter: https://online-audio-converter.com

목표: 총 미디어 파일 3MB 이하

---

## 🎮 게임 플레이 후 최종 확인

1. 배경 이미지가 잘 보이는가?
2. 음악 재생/일시정지가 작동하는가?
3. 볼륨 조절이 작동하는가?
4. 모바일에서도 잘 작동하는가?

문제가 있다면 브라우저 콘솔(F12)에서 에러 확인!

---

**즐거운 게임 되세요!** 🎮🏯🎵
