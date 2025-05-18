// 시뮬레이션 파라미터 변수 선언
// 시뮬레이션 파라미터 변수 선언
let r1, r2, m1, m2; // g는 아래에서 고정값으로 선언
let g = 9.8;      // 중력 가속도 고정
let a1, a2;           // 각도
let a1_v = 0, a2_v = 0; // 각속도

// HTML 요소들을 담을 변수 선언
let r1_slider, r2_slider, m1_slider, m2_slider; // g_slider 삭제
let r1_val_span, r2_val_span, m1_val_span, m2_val_span; // g_val_span 삭제
// ...
let resetButton;

// let trace; // 이 줄을 삭제하거나 주석 처리
let trace1, trace2; // 첫 번째, 두 번째 진자 자취 배열
let p5Canvas; // p5.js 캔버스 객체를 담을 변수

// p5.js의 setup 함수: 프로그램 시작 시 한 번만 실행됩니다.
function setup() {
    // 캔버스 생성 및 HTML 요소에 연결
    p5Canvas = createCanvas(600, 600);
    p5Canvas.parent('canvasContainer');

    // HTML 슬라이더 요소 가져오기
    r1_slider = select('#r1');
    r2_slider = select('#r2');
    m1_slider = select('#m1');
    m2_slider = select('#m2');

    // HTML span (값 표시) 요소 가져오기
    r1_val_span = select('#r1_val');
    r2_val_span = select('#r2_val');
    m1_val_span = select('#m1_val');
    m2_val_span = select('#m2_val');
    // HTML 버튼 요소 가져오기
    resetButton = select('#resetButton');

    // 각 슬라이더의 값이 변경될 때마다 resetSimulation 함수 호출
    r1_slider.input(resetSimulation);
    r2_slider.input(resetSimulation);
    m1_slider.input(resetSimulation);
    m2_slider.input(resetSimulation);
    g_slider.input(resetSimulation);

    // 리셋 버튼 클릭 시 resetSimulation 함수 호출
    resetButton.mousePressed(resetSimulation);

    // 프로그램 시작 시 초기 값 설정 및 시뮬레이션 상태 초기화를 위해 한 번 호출
    resetSimulation();
}

// 전역 변수 선언 부분 아래, 또는 setup() 함수 위에 추가해도 됩니다.

function resetSimulation() {
    // 슬라이더에서 현재 값으로 전역 변수 업데이트
    r1 = parseFloat(r1_slider.value());
    r2 = parseFloat(r2_slider.value());
    m1 = parseFloat(m1_slider.value());
    m2 = parseFloat(m2_slider.value());
    // span 태그에 현재 값 표시 업데이트
    r1_val_span.html(r1);
    r2_val_span.html(r2);
    m1_val_span.html(m1);
    m2_val_span.html(m2);
    // 시뮬레이션 상태(각도, 각속도) 초기화
    a1 = PI / 2; // 초기 각도
    a2 = PI / 2; // 초기 각도
    a1_v = 0;    // 초기 각속도
    a2_v = 0;    // 초기 각속도

    // 자취 배열 초기화
    // trace = []; // 이 줄을 삭제하거나 주석 처리
trace1 = []; // 첫 번째 진자 자취 초기화
trace2 = []; // 두 번째 진자 자취 초기화
    console.log("시뮬레이션 초기화됨. 현재 값:");
   console.log(`r1=<span class="math-inline">\{r1\}, r2\=</span>{r2}, m1=<span class="math-inline">\{m1\}, m2\=</span>{m2} (g는 ${g}로 고정)`); // 수정된 로그 예시
}
// p5.js의 draw 함수: setup 함수 실행 후 반복적으로 계속 실행됩니다. (애니메이션 효과)
function draw() {
    background(255); // 배경을 흰색으로 변경 (원래 코드와 유사하게)
    translate(width / 2, height / 3); // 원점을 캔버스 중앙 상단으로 이동

    // 물리 계산 (기존 Processing 코드와 거의 동일)
    // 1. 첫 번째 진자의 각가속도 (a1_a) 계산
    let num1 = -g * (2 * m1 + m2) * sin(a1);
    let num2 = -m2 * g * sin(a1 - 2 * a2);
    let num3 = -2 * sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
    let den1 = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = (num1 + num2 + num3 * num4) / den1;

    // 2. 두 번째 진자의 각가속도 (a2_a) 계산
    num1 = 2 * sin(a1 - a2);
    num2 = (a1_v * a1_v * r1 * (m1 + m2));
    num3 = g * (m1 + m2) * cos(a1);
    num4 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
    let den2 = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = (num1 * (num2 + num3 + num4)) / den2;

    // 각도 및 각속도 업데이트
    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    // (선택 사항) 감쇠 효과 - 약간의 공기 저항처럼 보이게 합니다.
    a1_v *= 0.999;
    a2_v *= 0.999;

    // 진자 위치 계산
    // 첫 번째 진자의 끝점 (x1, y1)
    let x1 = r1 * sin(a1);
    let y1 = r1 * cos(a1);

    // 두 번째 진자의 끝점 (x2, y2) - 첫 번째 진자에 상대적으로 계산
    let x2 = x1 + r2 * sin(a2);
    let y2 = y1 + r2 * cos(a2);

    // 진자 그리기
    stroke(0); // 선 색상 검정
    strokeWeight(2); // 선 굵기

    // 첫 번째 진자
    line(0, 0, x1, y1);        // 원점(0,0)에서 (x1,y1)까지 선
    fill(0);                   // 채우기 색상 검정
    ellipse(x1, y1, m1, m1);   // (x1,y1)에 첫 번째 추 그리기 (질량을 크기로 사용)

    // 두 번째 진자
    line(x1, y1, x2, y2);      // (x1,y1)에서 (x2,y2)까지 선
    fill(150, 0, 0);           // 채우기 색상 어두운 빨강
    ellipse(x2, y2, m2, m2);   // (x2,y2)에 두 번째 추 그리기 (질량을 크기로 사용)

    // 자취 그리기
    // trace 배열에 현재 두 번째 진자의 끝점 위치(p5.Vector 객체) 추가
    // 자취 기록
// trace.push(createVector(x2, y2)); // 기존 코드 삭제 또는 주석 처리

trace1.push(createVector(x1, y1)); // 첫 번째 추(x1,y1)의 자취를 trace1에 기록
trace2.push(createVector(x2, y2)); // 두 번째 추(x2,y2)의 자취를 trace2에 기록

// 자취가 너무 길어지지 않도록 제한 (예: 500개)
// if (trace.length > 500) { // 기존 코드 삭제 또는 주석 처리
//     trace.splice(0, 1);
// }
if (trace1.length > 500) { // trace1 길이 제한
    trace1.splice(0, 1);
}
if (trace2.length > 500) { // trace2 길이 제한
    trace2.splice(0, 1);
}

    // 자취 그리기
noFill(); // 자취는 선으로만 그림

// 첫 번째 진자 자취 (빨간색)
stroke(255, 0, 0); // 선 색상을 빨간색으로 설정 (RGB)
beginShape();
for (let v of trace1) { // trace1 배열의 각 벡터(위치)에 대해
    vertex(v.x, v.y);  // 정점을 연결
}
endShape();

// 두 번째 진자 자취 (파란색)
stroke(0, 0, 255); // 선 색상을 파란색으로 설정 (RGB)
beginShape();
for (let v of trace2) { // trace2 배열의 각 벡터(위치)에 대해
    vertex(v.x, v.y);  // 정점을 연결
}
endShape();
}