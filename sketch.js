// 시뮬레이션 파라미터 변수 선언
let r1, r2, m1, m2;
let g = 1;      // 중력 가속도 고정
let a1, a2;           // 각도
let a1_v = 0, a2_v = 0; // 각속도

// HTML 요소들을 담을 변수 선언
let r1_slider, r2_slider, m1_slider, m2_slider;
let r1_val_span, r2_val_span, m1_val_span, m2_val_span;
let resetButton;

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
    // g_slider 관련 코드는 여기서 완전히 제거되었습니다.

    // 리셋 버튼 클릭 시 resetSimulation 함수 호출
    resetButton.mousePressed(resetSimulation);

    // 프로그램 시작 시 초기 값 설정 및 시뮬레이션 상태 초기화를 위해 한 번 호출
    resetSimulation();
}

function resetSimulation() {
    // 슬라이더에서 현재 값으로 전역 변수 업데이트
    r1 = parseFloat(r1_slider.value());
    r2 = parseFloat(r2_slider.value());
    m1 = parseFloat(m1_slider.value());
    m2 = parseFloat(m2_slider.value());
    // g 값은 슬라이더에서 읽어오지 않고, 전역 변수 g = 9.8을 사용합니다.

    // span 태그에 현재 값 표시 업데이트
    r1_val_span.html(r1);
    r2_val_span.html(r2);
    m1_val_span.html(m1);
    m2_val_span.html(m2);
    // g_val_span 관련 코드는 제거되었습니다.

    // 시뮬레이션 상태(각도, 각속도) 초기화
    a1 = PI / 2; // 초기 각도
    a2 = PI / 2; // 초기 각도
    a1_v = 0;    // 초기 각속도
    a2_v = 0;    // 초기 각속도

    // 자취 배열 초기화
    trace1 = []; // 첫 번째 진자 자취 초기화
    trace2 = []; // 두 번째 진자 자취 초기화

    console.log("시뮬레이션 초기화됨. 현재 값:");
    console.log(`r1=${r1}, r2=${r2}, m1=${m1}, m2=${m2} (g는 ${g}로 고정)`);
}

function draw() {
    background(255);
    translate(width / 2, height / 3);

    // 물리 계산
    let num1_eq1 = -g * (2 * m1 + m2) * sin(a1); // 변수 이름 충돌 방지를 위해 _eq1, _eq2 추가 (내부 계산용)
    let num2_eq1 = -m2 * g * sin(a1 - 2 * a2);
    let num3_eq1 = -2 * sin(a1 - a2) * m2;
    let num4_eq1 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
    let den1 = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = (num1_eq1 + num2_eq1 + num3_eq1 * num4_eq1) / den1;

    let num1_eq2 = 2 * sin(a1 - a2);
    let num2_eq2 = (a1_v * a1_v * r1 * (m1 + m2));
    let num3_eq2 = g * (m1 + m2) * cos(a1);
    let num4_eq2 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
    let den2 = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = (num1_eq2 * (num2_eq2 + num3_eq2 + num4_eq2)) / den2;

    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    a1_v *= 0.999;
    a2_v *= 0.999;

    let x1 = r1 * sin(a1);
    let y1 = r1 * cos(a1);
    let x2 = x1 + r2 * sin(a2);
    let y2 = y1 + r2 * cos(a2);

    stroke(0);
    strokeWeight(2);

    line(0, 0, x1, y1);
    fill(0);
    ellipse(x1, y1, m1, m1);

    line(x1, y1, x2, y2);
    fill(150, 0, 0);
    ellipse(x2, y2, m2, m2);

    trace1.push(createVector(x1, y1));
    trace2.push(createVector(x2, y2));

    if (trace1.length > 500) {
        trace1.splice(0, 1);
    }
    if (trace2.length > 500) {
        trace2.splice(0, 1);
    }

    noFill();

    stroke(255, 0, 0);
    beginShape();
    for (let v of trace1) {
        vertex(v.x, v.y);
    }
    endShape();

    stroke(0, 0, 255);
    beginShape();
    for (let v of trace2) {
        vertex(v.x, v.y);
    }
    endShape();
}