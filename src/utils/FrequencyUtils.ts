// colours are based on US allocation chart
const serviceColours: Record<string, string> = {
  'not allocated': 'white',
  'aeronautical mobile': '#00AEE1',
  'aeronautical mobile satellite': '#97C9EC',
  'aeronautical radionavigation': '#C05018',
  amateur: '#419272',
  'amateur-satellite': '#D8E8DF',
  broadcasting: '#5095B6',
  'broadcasting-satellite': '#78B956',
  'earth exploration-satellite': '#E9984D',
  'inter-satellite': '#FAE486',
  'land mobile': '#FAE486',
  'land mobile-satellite': '#89CAD2',
  fixed: '#CC2B89',
  'fixed-satellite': '#B885B6',
  'maritime mobile': '#E8E5C6',
  'maritime mobile satellite': '#A3C8BD',
  'maritime radionavigation': '#5C8C76',
  'meteorological aids': '#EBD8C5',
  'meteorological-satellite': '#8D5E20',
  mobile: '#E6D4E6',
  'mobile-satellite': '#925EA0',
  'radio astronomy': '#8D5E20',
  'radio determination satellite': '#EEAD63',
  radiolocation: '#EDD04B',
  'radiolocation-satellite': '#BEA034',
  radionavigation: '#AEBC46',
  'radionavigation-satellite': '#E8EA7C',
  'space operation': '#97473C',
  'space research': '#DB9196',
  'standard frequency and time signal': '#90979B',
  'standard frequency and time signal-satellite': '#B3B4B8'
};

function getServices (): string[] {
  return Object.keys(serviceColours);
}

function getColourForService (serviceName: string): string {
  let idx = serviceName.toLowerCase().indexOf('except');
  if (idx > -1) {
    serviceName = serviceName.substring(0, idx);
  }
  idx = serviceName.indexOf('(');
  if (idx > -1) {
    serviceName = serviceName.substring(0, idx).trim();
  }
  serviceName = serviceName.trim().toLowerCase();
  let colour = serviceColours[serviceName];
  if (!colour) {
    colour = 'white';
  }

  return colour;
}

function humanHzUnits (value: number): string {
  let baseUnit = 'Hz';
  let divider = 1;
  if (value > 1e12) {
    baseUnit = 'THz';
    divider = 1e9;
  } else if (value > 1e9) {
    baseUnit = 'GHz';
    divider = 1e9;
  } else if (value > 1e6) {
    baseUnit = 'MHz';
    divider = 1e6;
  } else if (value > 1e3) {
    baseUnit = 'KHz';
    divider = 1e3;
  }

  return `${value / divider} ${baseUnit}`;
}

export { humanHzUnits, getColourForService, getServices };
