// 获取所有输入元素
const currentAge = document.getElementById('currentAge');
const savings = document.getElementById('savings');
const annualIncome = document.getElementById('annualIncome');
const savingRate = document.getElementById('savingRate');
const expectedIncome = document.getElementById('expectedIncome');
const resultSection = document.getElementById('result');
const familyIncome = document.getElementById('familyIncome');
const familyExpense = document.getElementById('familyExpense');

// 添加国家默认参数配置
const countryDefaults = {
    CN: { // 中国
        investmentReturn: 4.5,
        inflation: 2.5,
        lifeExpectancy: {
            male: 75,
            female: 80
        },
        description: "基于中国人民银行基准利率和历史通胀数据"
    },
    US: { // 美国
        investmentReturn: 6.0,
        inflation: 2.0,
        lifeExpectancy: {
            male: 77,
            female: 82
        },
        description: "基于美联储数据和标普500历史回报"
    },
    JP: { // 日本
        investmentReturn: 3.0,
        inflation: 1.0,
        lifeExpectancy: {
            male: 81,
            female: 87
        },
        description: "基于日本央行数据和历史经济指标"
    },
    GB: { // 英国
        investmentReturn: 5.0,
        inflation: 2.0,
        lifeExpectancy: {
            male: 79,
            female: 83
        },
        description: "基于英格兰银行数据"
    },
    DE: { // 德国
        investmentReturn: 4.0,
        inflation: 1.5,
        lifeExpectancy: {
            male: 79,
            female: 84
        },
        description: "基于欧洲央行数据"
    },
    SG: { // 新加坡
        investmentReturn: 5.0,
        inflation: 1.8,
        lifeExpectancy: {
            male: 82,
            female: 86
        },
        description: "基于新加坡金融管理局数据"
    }
};

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 添加性别选择
    const genderGroup = document.createElement('div');
    genderGroup.className = 'input-group';
    genderGroup.innerHTML = `
        <label for="gender">性别:</label>
        <select id="gender">
            <option value="male">男</option>
            <option value="female">女</option>
        </select>
    `;
    
    // 获取国籍选择元素
    const nationalitySelect = document.getElementById('nationality');
    
    // 将性别选择插入到国籍选择后面
    nationalitySelect.parentNode.after(genderGroup);

    // 添加说明文字区域
    const description = document.createElement('div');
    description.id = 'country-description';
    description.className = 'description';
    nationalitySelect.parentNode.after(description);

    // 获取性别选择元素
    const genderSelect = document.getElementById('gender');
    const investmentReturn = document.getElementById('investmentReturn');
    const inflation = document.getElementById('inflation');
    const lifeExpectancy = document.getElementById('lifeExpectancy');

    // 添加事件监听器
    nationalitySelect.addEventListener('change', function() {
        updateDefaults(nationalitySelect, genderSelect, investmentReturn, inflation, lifeExpectancy);
    });

    genderSelect.addEventListener('change', function() {
        updateDefaults(nationalitySelect, genderSelect, investmentReturn, inflation, lifeExpectancy);
    });

    // 初始化默认值
    updateDefaults(nationalitySelect, genderSelect, investmentReturn, inflation, lifeExpectancy);
});

// 更新默认值
function updateDefaults(nationalitySelect, genderSelect, investmentReturn, inflation, lifeExpectancy) {
    const country = nationalitySelect.value;
    const gender = genderSelect.value;
    const defaults = countryDefaults[country];

    console.log('更新默认值:', country, gender, defaults); // 调试信息

    investmentReturn.value = defaults.investmentReturn;
    inflation.value = defaults.inflation;
    lifeExpectancy.value = defaults.lifeExpectancy[gender];

    const descriptionElement = document.getElementById('country-description');
    descriptionElement.textContent = defaults.description;
    descriptionElement.style.display = 'block';
}

// 计算退休年龄
function calculateRetirement() {
    console.log('开始计算...'); // 调试信息

    const nationalitySelect = document.getElementById('nationality');
    const genderSelect = document.getElementById('gender');
    const investmentReturn = document.getElementById('investmentReturn');
    const inflation = document.getElementById('inflation');
    const lifeExpectancy = document.getElementById('lifeExpectancy');

    // 获取输入值
    const age = Number(currentAge.value);
    const currentSavings = Number(savings.value);
    const yearlyIncome = Number(annualIncome.value);
    const savingsRate = Number(savingRate.value) / 100;
    const monthlyExpectedIncome = Number(expectedIncome.value);
    const yearlyExpectedIncome = monthlyExpectedIncome * 12;
    const returnRate = Number(investmentReturn.value) / 100;
    const inflationRate = Number(inflation.value) / 100;
    const expectedLifespan = Number(lifeExpectancy.value);

    console.log('输入值:', { // 调试信息
        age, currentSavings, yearlyIncome, savingsRate, 
        monthlyExpectedIncome, returnRate, inflationRate, expectedLifespan
    });

    // 验证输入
    if (!validateInputs(age, currentSavings, yearlyIncome, savingsRate, monthlyExpectedIncome,
        returnRate, inflationRate, expectedLifespan)) {
        return;
    }

    // 计算退休年龄
    let retirementAge = solveRetirementAge(
        age, currentSavings, yearlyIncome, savingsRate,
        yearlyExpectedIncome, returnRate, inflationRate, expectedLifespan
    );

    console.log('计算结果:', retirementAge); // 调试信息

    // 显示结果
    displayResults(age, retirementAge, yearlyExpectedIncome, returnRate, inflationRate, expectedLifespan);
}

// 求解退休年龄的方程
function solveRetirementAge(currentAge, savings, yearlyIncome, savingsRate, 
    yearlyExpectedIncome, returnRate, inflationRate, lifeExpectancy) {
    
    let retirementAge = currentAge;
    const maxAge = 100;
    
    while (retirementAge < maxAge) {
        // 计算工作期间的累积资金（考虑投资回报）
        let totalSavings = savings;
        const workingYears = retirementAge - currentAge;
        
        // 计算工作期间的累积储蓄（考虑复利）
        for (let i = 0; i < workingYears; i++) {
            // 年度储蓄
            totalSavings += yearlyIncome * savingsRate;
            // 投资回报
            totalSavings *= (1 + returnRate);
        }
        
        // 计算退休后需要的总资金（考虑通货膨胀和投资回报）
        let requiredFunds = 0;
        let yearlyNeed = yearlyExpectedIncome;
        
        for (let year = 0; year < lifeExpectancy - retirementAge; year++) {
            // 考虑通货膨胀增加的支出
            yearlyNeed *= (1 + inflationRate);
            // 当年需要的资金
            requiredFunds += yearlyNeed;
            // 剩余资金继续投资
            requiredFunds *= (1 + returnRate);
        }
        
        // 如果积累的资金足够支付退休支出
        if (totalSavings >= requiredFunds) {
            break;
        }
        
        retirementAge++;
    }
    
    return retirementAge;
}

// 验证输入
function validateInputs(age, savings, income, rate, expectedIncome, returnRate, inflationRate, lifeExpectancy) {
    if (!age || age < 0 || age > 100) {
        alert('请输入有效的年龄（0-100岁）');
        return false;
    }
    if (!savings || savings < 0) {
        alert('请输入有效的当前存款');
        return false;
    }
    if (!income || income < 0) {
        alert('请输入有效的年收入');
        return false;
    }
    if (!rate || rate < 0 || rate > 1) {
        alert('请输入有效的储蓄率（0-100%）');
        return false;
    }
    if (!expectedIncome || expectedIncome < 0) {
        alert('请输入有效的预期退休收入');
        return false;
    }
    if (returnRate === undefined || returnRate < 0 || returnRate > 0.2) {
        alert('请输入有效的投资回报率（0-20%）');
        return false;
    }
    if (inflationRate === undefined || inflationRate < 0 || inflationRate > 0.1) {
        alert('请输入有效的通货膨胀率（0-10%）');
        return false;
    }
    if (!lifeExpectancy || lifeExpectancy < 60 || lifeExpectancy > 120) {
        alert('请输入有效的预期寿命（60-120岁）');
        return false;
    }
    return true;
}

// 添加检查必填字段的函数
function hasAllRequiredInputs() {
    return currentAge.value &&
           savings.value &&
           annualIncome.value &&
           savingRate.value &&
           expectedIncome.value;
}

// 更新显示结果函数
function displayResults(currentAge, retirementAge, yearlyExpectedIncome, returnRate, inflationRate, expectedLifespan) {
    const yearsToRetirement = retirementAge - currentAge;
    const nationalitySelect = document.getElementById('nationality');
    const country = nationalitySelect.value;
    const countryName = nationalitySelect.options[nationalitySelect.selectedIndex].text;
    
    // 获取家庭收支信息
    const monthlyFamilyIncome = Number(familyIncome.value) || 0;
    const monthlyFamilyExpense = Number(familyExpense.value) || 0;
    const monthlySurplus = monthlyFamilyIncome - monthlyFamilyExpense;
    
    if (retirementAge >= 100) {
        resultSection.innerHTML = `
            <h2>计算结果</h2>
            <p class="warning">根据当前的情况，可能难以达到预期的退休收入目标。</p>
            <p>建议：</p>
            <ul>
                <li>增加收入或储蓄率</li>
                <li>调整预期退休收入</li>
                <li>考虑更积极的投资策略</li>
                <li>寻求专业的理财建议</li>
            </ul>
            ${getFamilyAnalysis(monthlyFamilyIncome, monthlyFamilyExpense)}
            <p class="note">* 计算基于${countryName}的经济参数</p>
        `;
    } else {
        resultSection.innerHTML = `
            <h2>计算结果</h2>
            <p>预计退休年龄: <span class="highlight">${retirementAge}岁</span></p>
            <p>距离退休还需: <span class="highlight">${yearsToRetirement}年</span></p>
            <p>退休后年收入: <span class="highlight">${formatMoney(yearlyExpectedIncome)}元</span></p>
            <p>投资回报率: <span class="highlight">${(returnRate * 100).toFixed(1)}%</span></p>
            <p>通货膨胀率: <span class="highlight">${(inflationRate * 100).toFixed(1)}%</span></p>
            <p>预期寿命: <span class="highlight">${expectedLifespan}岁</span></p>
            ${getFamilyAnalysis(monthlyFamilyIncome, monthlyFamilyExpense)}
            <p class="note">* 数据基于${countryName}的经济指标</p>
            <p class="description">${countryDefaults[country].description}</p>
        `;
    }
    
    resultSection.classList.add('show');
}

// 格式化金额
function formatMoney(amount) {
    return amount.toLocaleString('zh-CN');
}

// 为所有输入框添加回车键支持
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateRetirement();
        }
    });
});

// 添加家庭收支分析函数
function getFamilyAnalysis(income, expense) {
    if (!income && !expense) {
        return '';
    }

    const surplus = income - expense;
    const surplusClass = surplus >= 0 ? 'positive' : 'negative';
    
    return `
        <div class="family-analysis">
            <h3>家庭收支分析</h3>
            ${income ? `<p>月收入: <span class="highlight">${formatMoney(income)}元</span></p>` : ''}
            ${expense ? `<p>月支出: <span class="highlight">${formatMoney(expense)}元</span></p>` : ''}
            ${income && expense ? `
                <p>月度结余: <span class="highlight ${surplusClass}">${formatMoney(surplus)}元</span></p>
                <p class="analysis-note">${getAnalysisNote(surplus)}</p>
            ` : ''}
        </div>
    `;
}

// 添加分析建议函数
function getAnalysisNote(surplus) {
    if (surplus > 10000) {
        return '您的家庭收支状况非常良好，建议将结余资金用于投资理财。';
    } else if (surplus > 5000) {
        return '您的家庭收支状况良好，建议适当增加储蓄和投资。';
    } else if (surplus > 0) {
        return '您的家庭收支基本平衡，建议控制支出并寻找增加收入的机会。';
    } else {
        return '您的家庭支出超过收入，建议及时调整支出结构，避免债务风险。';
    }
}