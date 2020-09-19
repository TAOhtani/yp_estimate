function loaded() {
    console.log("loaded");

    var modelNum = stl_viewer.models.length;
    var html = document.getElementById("stl");
    var info = "";
    var moveX = 0.0;

    info += '<h5>3Dモデル</h5>';

    for (var i = 1; i < modelNum + 1; i++) {
        info += '・';
        info += stl_viewer.get_model_info(i).name;
        info += '<input id="'
        info += i;
        info += '" onchange="calculate()" type="number" min="1" max="100" value="1">'
        info += '個';
        info += '<br>';

        var x = Math.round(stl_viewer.get_model_info(i).dims.x * 100) / 100;
        var y = Math.round(stl_viewer.get_model_info(i).dims.y * 100) / 100;
        var z = Math.round(stl_viewer.get_model_info(i).dims.z * 100) / 100;

        info += 'サイズ : ';
        info += x;
        info += 'mm * ';
        info += y;
        info += 'mm * ';
        info += z;
        info += 'mm';
        info += '<br>';

        var volume = Math.round(stl_viewer.get_model_info(i).volume) / 1000;

        info += '体積 : ';
        info += volume;
        info += 'ml';
        info += '<br>';
        info += '<br>';
    }

    if (modelNum > 1) {
        for (var i = 2; i < modelNum + 1; i++) {
            var x = Math.round(stl_viewer.get_model_info(i - 1).dims.x * 100) / 100;
            moveX = moveX + x + 10;
            stl_viewer.set_position(i, moveX, 0, 0);
            console.log(moveX);
        }
    }

    info += '<hr>';
    html.innerHTML = info;

    calculate();
}

function calculate() {

    var modelNum = stl_viewer.models.length;
    var html = document.getElementById("test1");
    var material = document.getElementById("mat").selectedIndex;
    var pitchIndex = document.getElementById("pitch").selectedIndex;
    var materialMoney = 0.0;
    var pitch = 0.0;
    var basicMoney = 2500.0;
    var info = "";
    var totalVolume = 0.0;
    var printNum = document.getElementById("printnum").value;
    var estimate = 0.0;

    //////////////       金額       /////////////// 

    switch (material) {
        case 0: //ホワイト
            materialMoney = 80;
            basicMoney = 2500.0;
            break;
        case 1: //クリア
            materialMoney = 70;
            basicMoney = 2500.0;
            break;
        case 2: //ABSライク
            materialMoney = 110;
            basicMoney = 2500.0;
            break;
        case 3: //PEライク
            materialMoney = 100;
            basicMoney = 2500.0;
            break;
        case 4: //PPライク
            materialMoney = 200;
            basicMoney = 3000.0;
            break;
        case 5: //シリコンライク
            materialMoney = 600;
            basicMoney = 5000.0;
            break;
        case 6: //耐熱
            materialMoney = 200;
            basicMoney = 5000.0;
            break;
        case 7: //ワックス
            materialMoney = 800;
            basicMoney = 3000.0;
            break;
    }

    //////////////       pitch      ///////////////

    switch (pitchIndex) {
        case 0: //標準
            pitch = 1.0;
            break;
        case 1: //高精細
            pitch = 2.0;
            break;
        case 2: //超高精細
            pitch = 4.5;
            break;
    }

    ///////////////////////////////////////////////

    for (var i = 1; i < modelNum + 1; i++) {
        var x = Math.round(stl_viewer.get_model_info(i).dims.x * 100) / 100;
        var y = Math.round(stl_viewer.get_model_info(i).dims.y * 100) / 100;
        var z = Math.round(stl_viewer.get_model_info(i).dims.z * 100) / 100;
        var volume = Math.round(stl_viewer.get_model_info(i).volume) / 1000;

        var modelPrintNum = document.getElementById(i).value;
        totalVolume = totalVolume + volume * modelPrintNum;
    }

    estimate = basicMoney * printNum + totalVolume * materialMoney * pitch;
    estimate = Math.round(estimate * 100) / 100;

    info += '<h5>見積金額</h5>';
    info += 'Total : ';
    info += totalVolume;
    info += 'ml';

    info += '<br>';
    info += '<h5>￥';
    info += estimate;
    info += '</h5>';

    info += '<hr>';

    info += '<h5>コピペ用</h5>';
    ///////  slackコピペ用 ////////
    info += '<b>・Slack用</b><br>';
    info += '基本料金 * 出力回数 + (モデル体積 * 出力個数) * 材料単価 * ディテール係数 =';
    info += '<br>';
    info += basicMoney;
    info += ' * ';
    info += printNum;
    info += ' + ( ';
    for (var i = 1; i < modelNum + 1; i++) {
        if (i > 1) {
            info += ' + ';
        }
        info += Math.round(stl_viewer.get_model_info(i).volume) / 1000;
        info += ' * ';
        info += document.getElementById(i).value;

    }
    info += ') * ';
    info += materialMoney;
    info += ' * ';
    info += pitch;
    info += ' = ';
    info += estimate;
    info += '<br>';
    //////////////////////////////

    ///////  見積書コピペ用 ////////
    info += '<b>・Wix見積書用</b><br>';
    for (var i = 1; i < modelNum + 1; i++) {
        info += stl_viewer.get_model_info(i).name;
        info += ':';
        info += document.getElementById(i).value;
        info += '個, ';
    }
    info += 'Total : ';
    info += totalVolume;
    info += 'ml';
    //////////////////////////////

    info += '<hr>';

    html.innerHTML = info;
}

//alert(JSON.stringify(stl_viewer.get_model_info(1)));