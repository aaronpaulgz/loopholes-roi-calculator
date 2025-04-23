// Constants
const MANUAL_TIME_PER_ASSET = 3; // hours
const MANUAL_COST_PER_HOUR = 350; // dollars
const AUTOMATED_TIME_PER_ASSET = 1 / 60; // 1 minute converted to hours
const AUTOMATED_COST_PER_ASSET = 12.5; // dollars

// DOM Elements
const manualAssetsInput = document.getElementById("manualAssetsPerMonth");
const automatedAssetsInput = document.getElementById("assetsPerMonth");
const timeSavedValue = document.getElementById("timeSavedValue");
const timeReductionValue = document.getElementById("timeReductionValue");
const manualTime = document.getElementById("manualTime");
const automatedTime = document.getElementById("automatedTime");
const roiValue = document.getElementById("roiValue");
const savedValue = document.getElementById("savedValue");
const manualAssetsCalc = document.getElementById("manualAssetsCalc");
const manualHoursCalc = document.getElementById("manualHoursCalc");
const manualTotalCost = document.getElementById("manualTotalCost");
const automatedAssetsCalc = document.getElementById("automatedAssetsCalc");
const automatedTotalCost = document.getElementById("automatedTotalCost");

// FTC Penalties slider and input sync
const ftcSlider = document.getElementById("ftcSlider");
const ftcValue = document.getElementById("ftcValue");

// Utility functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

function formatFTCValue(value) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(value);
}

function calculateSliderValue(sliderPosition) {
  // Base value is 1000 (representing $1,000)
  const baseValue = 1000;
  // Calculate exponential growth based on slider position (0-100)
  return Math.round(baseValue * sliderPosition);
}

// Calculation functions
const calculateManualTime = (assets) => {
  return assets * MANUAL_TIME_PER_ASSET;
};

const calculateAutomatedTime = (assets) => {
  return assets * AUTOMATED_TIME_PER_ASSET;
};

const calculateManualCost = (assets) => {
  return assets * MANUAL_TIME_PER_ASSET * MANUAL_COST_PER_HOUR;
};

const calculateAutomatedCost = (assets) => {
  return assets * AUTOMATED_COST_PER_ASSET;
};

const calculateTimeSaved = (manualTime, automatedTime) => {
  return manualTime - automatedTime;
};

const calculateTimeReduction = (manualTime, automatedTime) => {
  return ((manualTime - automatedTime) / manualTime) * 100;
};

const calculateROI = (manualCost, automatedCost) => {
  return ((manualCost - automatedCost) / automatedCost) * 100;
};

const calculateMonthlySavings = (manualCost, automatedCost) => {
  return manualCost - automatedCost;
};

// Update UI
const updateCalculator = () => {
  const manualAssets = parseInt(manualAssetsInput.value) || 0;
  const automatedAssets = parseInt(automatedAssetsInput.value) || 0;

  // Calculate times
  const manualTimeValue = calculateManualTime(manualAssets);
  const automatedTimeValue = calculateAutomatedTime(automatedAssets);
  const timeSaved = calculateTimeSaved(manualTimeValue, automatedTimeValue);
  const timeReduction = calculateTimeReduction(
    manualTimeValue,
    automatedTimeValue
  );

  // Calculate costs
  const manualCostValue = calculateManualCost(manualAssets);
  const automatedCostValue = calculateAutomatedCost(automatedAssets);
  const roi = calculateROI(manualCostValue, automatedCostValue);
  const monthlySavings = calculateMonthlySavings(
    manualCostValue,
    automatedCostValue
  );

  // Update time saved section
  timeSavedValue.textContent = formatNumber(timeSaved);
  timeReductionValue.textContent = formatNumber(timeReduction) + "%";
  manualTime.textContent = formatNumber(manualTimeValue);
  automatedTime.textContent = formatNumber(automatedTimeValue);

  // Update savings section
  roiValue.textContent = formatNumber(roi) + "%";
  savedValue.textContent = formatCurrency(monthlySavings);

  // Update calculations display
  manualAssetsCalc.textContent = `${manualAssets} assets x ${MANUAL_TIME_PER_ASSET} hours`;
  manualHoursCalc.textContent = `${formatNumber(
    manualTimeValue
  )} hours x ${formatCurrency(MANUAL_COST_PER_HOUR)}/hours`;
  automatedAssetsCalc.textContent = `${automatedAssets} assets $${AUTOMATED_COST_PER_ASSET}`;
};

// Event listeners
manualAssetsInput.addEventListener("input", () => {
  automatedAssetsInput.value = manualAssetsInput.value;
  updateCalculator();
});

automatedAssetsInput.addEventListener("input", () => {
  manualAssetsInput.value = automatedAssetsInput.value;
  updateCalculator();
});

ftcSlider.addEventListener("input", (e) => {
  const sliderValue = parseInt(e.target.value);
  ftcValue.value = sliderValue;
});

ftcValue.addEventListener("input", (e) => {
  let value = parseInt(e.target.value.replace(/,/g, ""));
  if (isNaN(value)) value = 1;
  if (value < 1) value = 1;
  if (value > 100) value = 100;
  ftcSlider.value = value;
  ftcValue.value = value;
});

// Initialize with default value
ftcValue.value = 1;

// Initialize calculator with default values
updateCalculator();
