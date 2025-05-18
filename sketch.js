// 시뮬레이션 파라미터 변수 선언
let r1, r2, m1, m2;
let g = 1.0;      // 중력 가속도 (시뮬레이션 안정성을 위해 1.0으로 유지, 필요시 조절)
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

    // span 태그에 현재 값 표시 업데이트
    r1_val_span.html(r1);
    r2_val_span.html(r2);
    m1_val_span.html(m1);
    m2_val_span.html(m2);

    // 시뮬레이션 상태(각도, 각속도) 초기화
    a1 = PI / 2; // 초기 각도 (수평 오른쪽)
    a2 = PI / 2; // 초기 각도 (수평 오른쪽)
    a1_v = 0;    // 초기 각속도
    a2_v = 0;    // 초기 각속도

    // 자취 배열 초기화
    trace1 = [];
    trace2 = [];

    console.log("시뮬레이션 초기화됨. 현재 값:");
    console.log(`r1=${r1}, r2=${r2}, m1=${m1}, m2=${m2} (g는 ${g}로 설정됨)`);
}

function draw() {
    background(255);
    translate(width / 2, height / 3);

    // --- 물리 계산 시작 ---
    let num1_eq1 = -g * (2 * m1 + m2) * sin(a1);
    let num2_eq1 = -m2 * g * sin(a1 - 2 * a2);
    let num3_eq1 = -2 * sin(a1 - a2) * m2;
    let num4_eq1 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * cos(a1 - a2);
    let den1 = r1 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a1_a = 0; // 분모가 0이 되는 경우 방지 초기화
    if (abs(den1) > 0.0001) { // 분모가 매우 작은 경우 계산하지 않음
        a1_a = (num1_eq1 + num2_eq1 + num3_eq1 * num4_eq1) / den1;
    }


    let num1_eq2 = 2 * sin(a1 - a2);
    let num2_eq2 = (a1_v * a1_v * r1 * (m1 + m2));
    let num3_eq2 = g * (m1 + m2) * cos(a1);
    let num4_eq2 = a2_v * a2_v * r2 * m2 * cos(a1 - a2);
    let den2 = r2 * (2 * m1 + m2 - m2 * cos(2 * a1 - 2 * a2));
    let a2_a = 0; // 분모가 0이 되는 경우 방지 초기화
    if (abs(den2) > 0.0001) { // 분모가 매우 작은 경우 계산하지 않음
        a2_a = (num1_eq2 * (num2_eq2 + num3_eq2 + num4_eq2)) / den2;
    }
    // --- 물리 계산 끝 ---

    // 각도 및 각속도 업데이트
    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    // 감쇠 효과 (값을 0.995 정도로 약간 더 강하게 설정)
   //a1_v *= 0.995;
    //a2_v *= 0.995;

    // --- 강제 정지 로직 시작 ---
    // 각도를 -PI ~ PI 범위 또는 0 ~ TWO_PI 범위로 정규화하여 비교 용이하게 함
    // 여기서는 modulo 연산자를 사용하여 각도가 계속 커지거나 작아지는 것을 방지하고,
    // 평형점 비교를 더 직관적으로 만듭니다.
    // (주의: 이 방식은 각도가 매우 빠르게 변할 때 갑자기 점프하는 것처럼 보일 수 있으나,
    //  거의 정지 상태를 판단할 때는 유용할 수 있습니다.)
    //  일단은 정규화 없이 속도와 운동량(유사값)만으로 판단해봅니다.

    let velocity_threshold = 0.005; // 속도 임계값 (이 값보다 작으면 정지 고려)
    let movement_threshold = 0.001; // 전체적인 움직임(운동량 유사값) 임계값

    // 각속도와 각가속도가 모두 매우 작을 때 정지 고려
    // (각가속도는 현재 프레임의 것이므로, 이것도 작다는 것은 힘의 평형에 가깝다는 의미)
    if (abs(a1_v) < velocity_threshold && abs(a2_v) < velocity_threshold &&
        abs(a1_a) < movement_threshold && abs(a2_a) < movement_threshold) {
        
        // 추가적으로 진자들이 거의 수직 아래에 있는지 (평형점 근처인지) 확인할 수 있음
        // 정규화된 각도 (0 ~ 2PI)
        let norm_a1 = (a1 % TWO_PI + TWO_PI) % TWO_PI; // 양수로 만들기 위해 +TWO_PI 후 다시 %
        let norm_a2 = (a2 % TWO_PI + TWO_PI) % TWO_PI;
        let angle_threshold = 0.1; // 약 5.7도 이내

        // 수직 아래 (0 또는 2PI) 근처인지 확인
        let is_a1_at_rest = (norm_a1 < angle_threshold || norm_a1 > TWO_PI - angle_threshold);
        let is_a2_at_rest = (norm_a2 < angle_threshold || norm_a2 > TWO_PI - angle_threshold);

        if (is_a1_at_rest && is_a2_at_rest) {
            a1_v = 0;
            a2_v = 0;
            // 각도도 정확한 평형점으로 고정 (선택 사항)
            // a1 = 0; 
            // a2 = 0;
            // console.log("Pendulums brought to rest by threshold.");
        }
    }
    // --- 강제 정지 로직 끝 ---


    // 진자 위치 계산
    let x1 = r1 * sin(a1);
    let y1 = r1 * cos(a1);
    let x2 = x1 + r2 * sin(a2);
    let y2 = y1 + r2 * cos(a2);

    // --- 그리기 시작 ---
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
    // --- 그리기 끝 ---
}