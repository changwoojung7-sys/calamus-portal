import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 연결
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://klgeuewpslppoxgvkiqj.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_DIR = path.join(process.cwd(), 'public', 'hospital_info_file');

/**
 * 엑셀 파일 찾기 (파일명 패턴 매칭)
 */
function findFileByPattern(pattern: string): string | null {
  if (!fs.existsSync(DATA_DIR)) return null;
  const files = fs.readdirSync(DATA_DIR);
  const found = files.find((f) => f.includes(pattern) && f.endsWith('.xlsx'));
  return found ? path.join(DATA_DIR, found) : null;
}

/**
 * 1. 전국 병원 기본정보 마이그레이션 (1.병원정보서비스)
 */
async function migrateHospitals() {
  const filePath = findFileByPattern('1.병원정보서비스');
  if (!filePath) {
    console.log('⚠️ 1.병원정보서비스 엑셀 파일이 없습니다.');
    return;
  }

  console.log(`\n🏥 [1/3] 병원 기본정보 마이그레이션 시작: ${path.basename(filePath)}`);
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  console.log(`총 ${rows.length}개 병원 데이터 파싱 완료. Supabase 적재 중...`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map((row) => {
      const isHospice = String(row['요양기관명'] || '').includes('호스피스') || String(row['요양기관명'] || '').includes('완화의료');
      const specialistCnt = (Number(row['의과전문의 인원수']) || 0) + (Number(row['한방전문의 인원수']) || 0) + (Number(row['치과전문의 인원수']) || 0);

      return {
        ykiho: String(row['암호화요양기호']),
        name: String(row['요양기관명']),
        category_code: String(row['종별코드']),
        category_name: String(row['종별코드명'] || ''),
        is_hospice: isHospice,
        post_no: row['우편번호'] ? String(row['우편번호']) : null,
        address: String(row['주소'] || ''),
        sido_code: row['시도코드'] ? String(row['시도코드']) : null,
        sido_name: row['시도코드명'] ? String(row['시도코드명']) : null,
        sggu_code: row['시군구코드'] ? String(row['시군구코드']) : null,
        sggu_name: row['시군구코드명'] ? String(row['시군구코드명']) : null,
        emdong_name: row['읍면동'] ? String(row['읍면동']) : null,
        tel: row['전화번호'] ? String(row['전화번호']) : null,
        url: row['병원홈페이지'] ? String(row['병원홈페이지']) : null,
        established_date: row['개설일자'] ? String(row['개설일자']) : null,
        doctor_total_cnt: Number(row['총의사수']) || 0,
        specialist_cnt: specialistCnt,
        general_cnt: (Number(row['의과일반의 인원수']) || 0) + (Number(row['한방일반의 인원수']) || 0),
        intern_cnt: Number(row['의과인턴 인원수']) || 0,
        resident_cnt: Number(row['의과레지던트 인원수']) || 0,
        latitude: row['좌표(Y)'] ? parseFloat(row['좌표(Y)']) : null,
        longitude: row['좌표(X)'] ? parseFloat(row['좌표(X)']) : null,
      };
    });

    const { error } = await supabase.from('hosapi_hospital').upsert(batch, { onConflict: 'ykiho' });
    if (error) {
      console.error(`❌ [hosapi_hospital] ${i} ~ ${i + batch.length} 적재 에러:`, error.message);
    } else {
      process.stdout.write(`\r✅ 병원 적재 진행: ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length} (${Math.round((Math.min(i + BATCH_SIZE, rows.length) / rows.length) * 100)}%)`);
    }
  }
  console.log('\n✨ 병원 기본정보 마이그레이션 완료!');
}

/**
 * 2. 전국 약국 기본정보 마이그레이션 (2.약국정보서비스)
 */
async function migratePharmacies() {
  const filePath = findFileByPattern('2.약국정보서비스');
  if (!filePath) {
    console.log('⚠️ 2.약국정보서비스 엑셀 파일이 없습니다.');
    return;
  }

  console.log(`\n💊 [2/3] 약국 정보 마이그레이션 시작: ${path.basename(filePath)}`);
  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  console.log(`총 ${rows.length}개 약국 데이터 파싱 완료. Supabase 적재 중...`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map((row) => ({
      ykiho: String(row['암호화요양기호']),
      name: String(row['요양기관명']),
      category_code: String(row['종별코드'] || '81'),
      category_name: String(row['종별코드명'] || '약국'),
      post_no: row['우편번호'] ? String(row['우편번호']) : null,
      address: String(row['주소'] || ''),
      sido_code: row['시도코드'] ? String(row['시도코드']) : null,
      sido_name: row['시도코드명'] ? String(row['시도코드명']) : null,
      sggu_code: row['시군구코드'] ? String(row['시군구코드']) : null,
      sggu_name: row['시군구코드명'] ? String(row['시군구코드명']) : null,
      emdong_name: row['읍면동'] ? String(row['읍면동']) : null,
      tel: row['전화번호'] ? String(row['전화번호']) : null,
      established_date: row['개설일자'] ? String(row['개설일자']) : null,
      latitude: row['좌표(Y)'] ? parseFloat(row['좌표(Y)']) : null,
      longitude: row['좌표(X)'] ? parseFloat(row['좌표(X)']) : null,
    }));

    const { error } = await supabase.from('hosapi_pharmacy').upsert(batch, { onConflict: 'ykiho' });
    if (error) {
      console.error(`❌ [hosapi_pharmacy] ${i} ~ ${i + batch.length} 적재 에러:`, error.message);
    } else {
      process.stdout.write(`\r✅ 약국 적재 진행: ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length} (${Math.round((Math.min(i + BATCH_SIZE, rows.length) / rows.length) * 100)}%)`);
    }
  }
  console.log('\n✨ 약국 정보 마이그레이션 완료!');
}

/**
 * 3. 병원 상세정보 집계 및 마이그레이션 (시설, 세부정보, 진료과, 장비, 교통, 간호등급, 식대가산, 전문병원, 기타인력)
 */
async function migrateHospitalDetails() {
  console.log(`\n🔬 [3/3] 병의원 상세정보 종합 집계 시작...`);

  const detailMap = new Map<string, any>();

  // 3-1. 시설 정보 (병상수)
  const facilityFile = findFileByPattern('시설정보');
  if (facilityFile) {
    console.log(`- 시설정보 파싱 중... (${path.basename(facilityFile)})`);
    const wb = XLSX.readFile(facilityFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const totalBeds = (Number(r['일반입원실일반병상수']) || 0) + (Number(r['일반입원실상급병상수']) || 0) + (Number(r['성인중환자병상수']) || 0);
      detailMap.set(ykiho, {
        ykiho,
        total_beds: totalBeds,
        general_beds: Number(r['일반입원실일반병상수']) || 0,
        general_vip_beds: Number(r['일반입원실상급병상수']) || 0,
        icu_adult_beds: Number(r['성인중환자병상수']) || 0,
        icu_child_beds: (Number(r['소아중환자병상수']) || 0) + (Number(r['신생아중환자병상수']) || 0),
        er_beds: Number(r['응급실병상수']) || 0,
        pt_beds: Number(r['물리치료실병상수']) || 0,
        isolated_beds: Number(r['격리병실병상수']) || 0,
        treatments: [],
        special_treatments: [],
        equipments: [],
        transports: [],
        detailed_info: {},
        meal_info: [],
        other_staff: [],
        special_hospital_field: null,
      });
    }
  }

  // 3-2. 세부정보 (진료시간, 응급실, 주차, 점심시간)
  const dtlFile = findFileByPattern('세부정보');
  if (dtlFile) {
    console.log(`- 세부정보 (진료시간/응급실/주차) 파싱 중... (${path.basename(dtlFile)})`);
    const wb = XLSX.readFile(dtlFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      item.detailed_info = {
        parking_count: r['주차_가능대수'],
        parking_cost: r['주차_비용 부담여부'],
        parking_memo: r['주차_기타 안내사항'],
        sun_closed: r['휴진안내_일요일'],
        holiday_closed: r['휴진안내_공휴일'],
        er_day_yn: r['응급실_주간_운영여부'],
        er_day_tel: r['응급실_주간_전화번호1'],
        er_night_yn: r['응급실_야간_운영여부'],
        er_night_tel: r['응급실_야간_전화번호1'],
        lunch_weekday: r['점심시간_평일'],
        lunch_sat: r['점심시간_토요일'],
        rcpt_weekday: r['접수시간_평일'],
        rcpt_sat: r['접수시간_토요일'],
        mon_time: r['진료시작시간_월요일'] ? `${r['진료시작시간_월요일']}~${r['진료종료시간_월요일']}` : null,
        sat_time: r['진료시작시간_토요일'] ? `${r['진료시작시간_토요일']}~${r['진료종료시간_토요일']}` : null,
      };
      detailMap.set(ykiho, item);
    }
  }

  // 3-3. 진료과목 정보
  const dgsFile = findFileByPattern('진료과목정보');
  if (dgsFile) {
    console.log(`- 진료과목 정보 결합 중... (${path.basename(dgsFile)})`);
    const wb = XLSX.readFile(dgsFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      if (r['진료과목코드명'] && !item.treatments.includes(r['진료과목코드명'])) {
        item.treatments.push(String(r['진료과목코드명']));
      }
      detailMap.set(ykiho, item);
    }
  }

  // 3-4. 의료장비 정보
  const eqpFile = findFileByPattern('의료장비정보');
  if (eqpFile) {
    console.log(`- 의료장비 정보 결합 중... (${path.basename(eqpFile)})`);
    const wb = XLSX.readFile(eqpFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      const eqpStr = `${r['장비코드명'] || '장비'} (${r['장비대수'] || 1}대)`;
      if (!item.equipments.includes(eqpStr)) {
        item.equipments.push(eqpStr);
      }
      detailMap.set(ykiho, item);
    }
  }

  // 3-5. 특수진료 정보
  const spcFile = findFileByPattern('특수진료정보');
  if (spcFile) {
    console.log(`- 특수진료 정보 결합 중... (${path.basename(spcFile)})`);
    const wb = XLSX.readFile(spcFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      if (r['검색코드명'] && !item.special_treatments.includes(r['검색코드명'])) {
        item.special_treatments.push(String(r['검색코드명']));
      }
      detailMap.set(ykiho, item);
    }
  }

  // 3-6. 전문병원 지정분야
  const spHospFile = findFileByPattern('전문병원지정분야');
  if (spHospFile) {
    console.log(`- 전문병원지정분야 파싱 중... (${path.basename(spHospFile)})`);
    const wb = XLSX.readFile(spHospFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      item.special_hospital_field = r['검색코드명'] ? String(r['검색코드명']) : null;
      detailMap.set(ykiho, item);
    }
  }

  // 3-7. 간호등급 정보
  const nursFile = findFileByPattern('간호등급정보');
  if (nursFile) {
    console.log(`- 간호등급 정보 결합 중... (${path.basename(nursFile)})`);
    const wb = XLSX.readFile(nursFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      if (r['간호등급']) {
        item.nursing_grade = `${r['간호등급']}등급`;
      }
      detailMap.set(ykiho, item);
    }
  }

  // 3-8. 식대가산 정보
  const mealFile = findFileByPattern('식대가산정보');
  if (mealFile) {
    console.log(`- 식대가산정보 파싱 중... (${path.basename(mealFile)})`);
    const wb = XLSX.readFile(mealFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      item.meal_info.push(`${r['유형코드명'] || ''} (가산:${r['일반식 가산여부'] || 'N'})`);
      detailMap.set(ykiho, item);
    }
  }

  // 3-9. 기타인력 정보 (약사, 물리치료사, 방사선사 등)
  const staffFile = findFileByPattern('기타인력정보');
  if (staffFile) {
    console.log(`- 기타인력정보 파싱 중... (${path.basename(staffFile)})`);
    const wb = XLSX.readFile(staffFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      item.other_staff.push(`${r['기타인력코드명'] || '인력'} ${r['기타인력수'] || 1}명`);
      detailMap.set(ykiho, item);
    }
  }

  // 3-10. 교통 정보
  const trnFile = findFileByPattern('교통정보');
  if (trnFile) {
    console.log(`- 교통정보 결합 중... (${path.basename(trnFile)})`);
    const wb = XLSX.readFile(trnFile);
    const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    for (const r of rows) {
      const ykiho = String(r['암호화요양기호']);
      const item = detailMap.get(ykiho) || { ykiho, treatments: [], special_treatments: [], equipments: [], transports: [], detailed_info: {}, meal_info: [], other_staff: [] };
      const trnStr = `${r['교통편명'] || ''} ${r['노선번호'] || ''} ${r['하차지점'] || ''}`.trim();
      if (trnStr && !item.transports.includes(trnStr)) {
        item.transports.push(trnStr);
      }
      detailMap.set(ykiho, item);
    }
  }

  const detailList = Array.from(detailMap.values()).map(item => {
    // 키워드 통합 문자열 생성 (진료과, 장비, 특수진료, 전문병원 등)
    const kw = [
      ...(item.treatments || []),
      ...(item.special_treatments || []),
      ...(item.equipments || []),
      item.special_hospital_field,
      item.nursing_grade,
    ].filter(Boolean).join(' ');
    return {
      ...item,
      search_keywords: kw,
    };
  });

  console.log(`총 ${detailList.length}건 상세정보 집계 완료. Supabase 적재 중...`);

  const BATCH_SIZE = 500;
  for (let i = 0; i < detailList.length; i += BATCH_SIZE) {
    const batch = detailList.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('hosapi_hospital_detail').upsert(batch, { onConflict: 'ykiho' });
    if (error) {
      console.error(`❌ [hosapi_hospital_detail] ${i} ~ ${i + batch.length} 적재 에러:`, error.message);
    } else {
      process.stdout.write(`\r✅ 상세정보 적재 진행: ${Math.min(i + BATCH_SIZE, detailList.length)} / ${detailList.length} (${Math.round((Math.min(i + BATCH_SIZE, detailList.length) / detailList.length) * 100)}%)`);
    }
  }
  console.log('\n✨ 병의원 상세정보 종합 마이그레이션 완료!');

  // 병원 기본정보 테이블(hosapi_hospital)의 search_keywords 에도 동기화
  console.log('\n🔄 병원 기본정보 테이블 search_keywords 일괄 업데이트 중...');
  for (let i = 0; i < detailList.length; i += BATCH_SIZE) {
    const batch = detailList.slice(i, i + BATCH_SIZE).map(d => ({
      ykiho: d.ykiho,
      search_keywords: d.search_keywords,
    }));
    await supabase.from('hosapi_hospital').upsert(batch, { onConflict: 'ykiho' });
  }
  console.log('✨ search_keywords 동기화 완료!');
}


/**
 * 메인 실행 함수 (분기별 엑셀 파일 자동 일괄 동기화)
 */
export async function runQuarterlyAutoMigration() {
  console.log('================================================================');
  console.log('🚀 [Calamus Care] 분기별 심평원 엑셀 데이터 자동 마이그레이션 시작');
  console.log('📂 데이터 폴더:', DATA_DIR);
  console.log('================================================================');

  try {
    await migrateHospitals();
    await migratePharmacies();
    await migrateHospitalDetails();
    console.log('\n🎉 [성공] 모든 심평원 데이터가 Supabase DB에 성공적으로 동기화되었습니다!');
  } catch (err: any) {
    console.error('\n❌ [오류 발생]:', err.message);
  }
}

// CLI 직접 실행 지원
if (require.main === module) {
  runQuarterlyAutoMigration().catch(console.error);
}
