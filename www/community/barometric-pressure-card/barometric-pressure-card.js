let Lit;try{Lit=await import("lit")}catch{Lit=await import("https://cdn.jsdelivr.net/npm/lit@3/+esm")}const{LitElement:e,html:t,css:i,nothing:a,svg:s}=Lit,fireEvent=(e,t,i={},a={})=>{let s=new Event(t,{bubbles:a?.bubbles??!0,cancelable:a?.cancelable??!1,composed:a?.composed??!0});return s.detail=i,e.dispatchEvent(s),s},HPA_PER_INHG=33.8638866667,toHpa=(e,t)=>{if(null==e||""===e||Number.isNaN(Number(e)))return NaN;let i=Number(e);switch((t||"").toLowerCase()){case"hpa":case"mbar":default:return i;case"kpa":return 10*i;case"mmhg":return i/.75006156;case"inhg":return 33.8638866667*i}},fromHpa=(e,t)=>{switch((t||"auto").toLowerCase()){case"hpa":case"auto":case"mbar":default:return e;case"kpa":return e/10;case"mmhg":return .75006156*e;case"inhg":return e/33.8638866667}},unitLabel=(e,t)=>e&&"auto"!==e?"mbar"===e.toLowerCase()?"mbar":e:t||"hPa",trendIcon=e=>"rising"===e?"▲":"falling"===e?"▼":"■",slpStandard=(e,t)=>Number.isFinite(e)&&Number.isFinite(t)?e/Math.pow(1-t/44330,5.255):e,slpTempAdjusted=(e,t,i)=>{if(!Number.isFinite(e)||!Number.isFinite(t))return e;let a=Number.isFinite(i)?i+273.15:288.15,s=9.80665/1.865825;return e*Math.pow(1-.0065*t/(a+.0065*t),-s)},approxHpaOffsetForElevation=e=>Number.isFinite(e)?e/8.3:0,clamp=(e,t,i)=>Math.max(t,Math.min(i,e)),parseRgb=e=>{let t=/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(e||"");return t?{r:+t[1],g:+t[2],b:+t[3]}:null},luminance=e=>{let t=e=>(e/=255)<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4);return .2126*t(e.r)+.7152*t(e.g)+.0722*t(e.b)},I18N={cs:{card_title:"Barometrick\xfd tlak",current:"Aktu\xe1lně",trend_rising:"roste",trend_falling:"kles\xe1",trend_steady:"stabiln\xed",level_low:"n\xedzk\xfd",level_normal:"norm\xe1ln\xed",level_high:"vysok\xfd",thresholds:(e,t)=>`Prahy: ${e}/${t} hPa (MSL)`,entity_missing:e=>`Entita "${e}" nenalezena`,fc_storm:"bouřkově / vytrval\xfd d\xe9šť",fc_improving_after_front:"zlepšen\xed po frontě",fc_rain_likely:"d\xe9šť pravděpodobn\xfd",fc_showers_improving:"přeh\xe1ňky, zlepšen\xed",fc_variable:"proměnlivo",fc_improving:"zlepšen\xed, proměnlivo",fc_worsening_showers:"zhoršen\xed, přeh\xe1ňky",fc_fine_sunny:"pěkně / jasno",fc_slight_worsening:"m\xedrn\xe9 zhoršen\xed",fc_rather_fine:"sp\xedše pěkně",fc_still_fine:"st\xe1le pěkně",fc_clear_stable:"jasno / stabiln\xed",ed_lang:"Jazyk",ed_threshold_unit:"Jednotky prahů (LOW/HIGH)",ed_threshold_hint:"Zadej buď hPa NEBO inHg; druh\xe9 se dopoč\xedt\xe1.",ed_dual_sync:"Sync inHg s hPa v dual režimu"},en:{card_title:"Barometric Pressure",current:"Current",trend_rising:"rising",trend_falling:"falling",trend_steady:"steady",level_low:"low",level_normal:"normal",level_high:"high",thresholds:(e,t)=>`Thresholds: ${e}/${t} hPa (MSL)`,entity_missing:e=>`Entity "${e}" not found`,fc_storm:"stormy / steady rain",fc_improving_after_front:"improving after front",fc_rain_likely:"rain likely",fc_showers_improving:"showers, improving",fc_variable:"variable",fc_improving:"improving, changeable",fc_worsening_showers:"worsening, showers",fc_fine_sunny:"fine / sunny",fc_slight_worsening:"slight deterioration",fc_rather_fine:"rather fine",fc_still_fine:"still fine",fc_clear_stable:"clear / stable",ed_lang:"Language",ed_threshold_unit:"Threshold units (LOW/HIGH)",ed_threshold_hint:"Enter either hPa OR inHg; the other is derived.",ed_dual_sync:"Sync inHg with hPa in dual mode"}};function resolveLang(e,t){let i=(t?.lang||e?.locale?.language||e?.language||"undefined"!=typeof navigator&&navigator.language||"en").toString().toLowerCase(),a=i.startsWith("cs")?"cs":(i.startsWith("en"),"en");return I18N[a]}function getWindBearingDeg(e,t){if(!t||!e?.states[t])return;let i=e.states[t],a=i.attributes||{},s=Number.isFinite(+i.state)?+i.state:Number(a.wind_bearing??a.bearing??a.wind_direction??a.direction);if(Number.isFinite(s))return(s%360+360)%360;let l=(i.state||a.direction||"").toString().toUpperCase();return({N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5})[l]}function forecastSimple(e,t,i){if(!Number.isFinite(e))return{icon:"?",text:"n/a"};let a=(t||"steady").toLowerCase();return e<995?{icon:"☂",text:"rising"===a?i.fc_improving_after_front:i.fc_storm}:e<1005?{icon:"rising"===a?"\uD83C\uDF26":"\uD83C\uDF27",text:"rising"===a?i.fc_showers_improving:i.fc_rain_likely}:e<1015?{icon:"rising"===a?"\uD83C\uDF24":"falling"===a?"\uD83C\uDF26":"☁",text:"rising"===a?i.fc_improving:"falling"===a?i.fc_worsening_showers:i.fc_variable}:e<1025?{icon:"rising"===a?"☀":"falling"===a?"\uD83C\uDF24":"\uD83C\uDF25",text:"rising"===a?i.fc_fine_sunny:"falling"===a?i.fc_slight_worsening:i.fc_rather_fine}:{icon:"falling"===a?"\uD83C\uDF25":"☀",text:"falling"===a?i.fc_still_fine:i.fc_clear_stable}}function forecastZamberetti(e,t,i,a="north",s="auto",l=I18N.cs){if(!Number.isFinite(e))return{icon:"?",text:"n/a"};let n=(t||"steady").toLowerCase(),r;r="rising"===n?e<1e3?2:e<1010?3:4:"falling"===n?e<995?0:e<1005?1:e<1015?2:3:e<1e3?1:e<1010?2:e<1020?3:4;let o=new Date().getMonth(),h;if((h="summer"===s||"winter"!==s&&("south"===a?o>=9||o<=2:o>=3&&o<=8))&&"falling"===n&&(r=Math.max(0,r-1)),Number.isFinite(i)){let c=i;"south"===a&&(c=(c+180)%360);let d=c>=190&&c<=300,g=c>=20&&c<=160;d?r=Math.max(0,r-1):g&&(r=Math.min(4,r+1))}let u=[{icon:"☂",text:l.fc_storm},{icon:"\uD83C\uDF27",text:l.fc_rain_likely},{icon:"\uD83C\uDF26",text:l.fc_variable},{icon:"\uD83C\uDF24",text:l.fc_rather_fine},{icon:"☀",text:l.fc_fine_sunny},];return u[clamp(r,0,4)]}class BarometricPressureCard extends e{static get properties(){return{hass:{},_config:{}}}static getConfigElement(){return document.createElement("barometric-pressure-card-editor")}static getStubConfig(e,t){let i=(t||[]).map(t=>e.states[t]).filter(Boolean).find(e=>["hpa","mbar","kpa","mmhg","inhg"].includes((e.attributes.unit_of_measurement||"").toLowerCase()));return{entity:i?.entity_id||"sensor.pressure"}}setConfig(e){if(!e||!e.entity)throw Error('Nastav pros\xedm "entity".');this._config={name:e.name,entity:e.entity,unit:e.unit||"auto",decimals:Number.isFinite(e.decimals)?e.decimals:1,show_trend:!1!==e.show_trend,trend_threshold_hpa:Number.isFinite(e.trend_threshold_hpa)?e.trend_threshold_hpa:.4,lang:e.lang||"auto",threshold_unit:(e.threshold_unit||"auto").toLowerCase(),low_hpa:Number.isFinite(e.low_hpa)?e.low_hpa:1005,high_hpa:Number.isFinite(e.high_hpa)?e.high_hpa:1025,low_inhg:Number.isFinite(e.low_inhg)?e.low_inhg:void 0,high_inhg:Number.isFinite(e.high_inhg)?e.high_inhg:void 0,normalize_msl:!1!==e.normalize_msl,temperature_entity:e.temperature_entity||null,show_level:!1!==e.show_level,show_gauge:!1!==e.show_gauge,gauge_scale:(e.gauge_scale||"dual").toLowerCase(),gauge_start_deg:Number.isFinite(e.gauge_start_deg)?e.gauge_start_deg:-120,gauge_sweep_deg:Number.isFinite(e.gauge_sweep_deg)?e.gauge_sweep_deg:240,gauge_width:Number.isFinite(e.gauge_width)?Number(e.gauge_width):320,gauge_height:Number.isFinite(e.gauge_height)?Number(e.gauge_height):210,inhg_label_offset:Number.isFinite(e.inhg_label_offset)?Number(e.inhg_label_offset):12,hpa_label_offset:Number.isFinite(e.hpa_label_offset)?Number(e.hpa_label_offset):12,gauge_offset_x:Number.isFinite(e.gauge_offset_x)?Number(e.gauge_offset_x):0,gauge_offset_y:Number.isFinite(e.gauge_offset_y)?Number(e.gauge_offset_y):0,scale_hpa_min:Number.isFinite(e.scale_hpa_min)?e.scale_hpa_min:980,scale_hpa_max:Number.isFinite(e.scale_hpa_max)?e.scale_hpa_max:1040,scale_hpa_major:Number.isFinite(e.scale_hpa_major)?e.scale_hpa_major:10,scale_hpa_minor:Number.isFinite(e.scale_hpa_minor)?e.scale_hpa_minor:2,scale_inhg_min:Number.isFinite(e.scale_inhg_min)?e.scale_inhg_min:28,scale_inhg_max:Number.isFinite(e.scale_inhg_max)?e.scale_inhg_max:31,scale_inhg_major:Number.isFinite(e.scale_inhg_major)?e.scale_inhg_major:.5,scale_inhg_minor:Number.isFinite(e.scale_inhg_minor)?e.scale_inhg_minor:.1,dual_sync:!1!==e.dual_sync,contrast_mode:e.contrast_mode||"auto",show_range_arcs:!1!==e.show_range_arcs,range_arc_width:Number.isFinite(e.range_arc_width)?e.range_arc_width:8,show_forecast:!1!==e.show_forecast,forecast_mode:(e.forecast_mode||"zambretti").toLowerCase(),wind_entity:e.wind_entity||null,hemisphere:(e.hemisphere||"north").toLowerCase(),season_mode:(e.season_mode||"auto").toLowerCase()}}getCardSize(){return 3}_tone(){let e=(this._config.contrast_mode||"auto").toLowerCase();if("dark"===e||"light"===e)return e;try{let t=getComputedStyle(this).getPropertyValue("--card-background-color")||getComputedStyle(this).getPropertyValue("--ha-card-background")||getComputedStyle(this).backgroundColor,i=parseRgb(t);if(!i)return"dark";return .4>luminance(i)?"dark":"light"}catch{return"dark"}}render(){if(!this.hass||!this._config)return a;let e=resolveLang(this.hass,this._config),i=this.hass.states[this._config.entity];if(!i)return t`<ha-card><div class="wrapper">
        <div class="header">${this._config.name||e.card_title}</div>
        <div class="value missing">${e.entity_missing(this._config.entity)}</div>
      </div></ha-card>`;let s=i.state,l=i.attributes||{},n=l.unit_of_measurement||"hPa",r=toHpa(s,n),o=this.hass?.config?.elevation??0,h=Number.isFinite(l.temperature)?Number(l.temperature):void 0,c=this._config.temperature_entity;if(c&&this.hass.states[c]){let d=this.hass.states[c],g=d.attributes||{},u=g.unit_of_measurement||(d.entity_id.startsWith("weather.")?"\xb0C":null),p=Number(d.state??g.temperature);Number.isFinite(p)&&(h=u&&u.toLowerCase().includes("f")?(p-32)*(5/9):p)}let m=!1!==this._config.normalize_msl,f=m?Number.isFinite(h)?slpTempAdjusted(r,o,h):slpStandard(r,o):r,v=this._config.unit||"auto",$=fromHpa(f,v),w=Math.max(0,Number(this._config.decimals)||0),b=unitLabel(v,n),_=Number.isFinite($)?$.toFixed(w):"—",x=(this._config.threshold_unit||"auto").toLowerCase(),y=Number.isFinite(this._config.low_inhg)&&Number.isFinite(this._config.high_inhg),k=Number(this._config.low_hpa),F=Number(this._config.high_hpa);"inhg"!==x&&(Number.isFinite(k)&&Number.isFinite(F)||!y)||(k=toHpa(this._config.low_inhg,"inhg"),F=toHpa(this._config.high_inhg,"inhg"));let P="normal";if(m)f<k?P="low":f>F&&(P="high");else{let z=approxHpaOffsetForElevation(o);r<k-z?P="low":r>F-z&&(P="high")}let S="low"===P?e.level_low:"high"===P?e.level_high:e.level_normal,L=(l.pressure_trend||l.trend||"").toString().toLowerCase();if(!["rising","falling","steady"].includes(L)){let C=`bp-card:${this._config.entity}:last`;try{let H=JSON.parse(localStorage.getItem(C)||"null");if(H&&"number"==typeof H.hpa){let E=r-H.hpa,j=this._config.trend_threshold_hpa;L=E>j?"rising":E<-j?"falling":"steady"}localStorage.setItem(C,JSON.stringify({hpa:r,ts:Date.now()}))}catch{}L||(L="steady")}let N=null;if(!1!==this._config.show_forecast){if("simple"===this._config.forecast_mode)N=forecastSimple(f,L,e);else{let I=getWindBearingDeg(this.hass,this._config.wind_entity);N=forecastZamberetti(f,L,I,this._config.hemisphere,this._config.season_mode,e)}}let W=this._tone();return t`
      <ha-card class="level-border ${P}">
        <div class="grid">
          ${this._config.show_gauge?t`<div class="gauge">${this._renderGaugeSvg(f,k,F,W)}</div>`:a}

          <div class="right">
            <div class="header">${this._config.name||i.attributes.friendly_name||e.card_title}</div>
            <div class="current-label">${e.current}</div>
            <div class="current-value">
              <span class="number">${_}</span>
              <span class="unit">${b}</span>
              ${m?t`<span class="chip">MSL</span>`:a}
            </div>

            <div class="meta">
              ${this._config.show_trend?t`
                <div class="trend" title=${L}>
                  <span class="trend-icon ${L}">${trendIcon(L)}</span>
                  <span class="trend-label">${"rising"===L?e.trend_rising:"falling"===L?e.trend_falling:e.trend_steady}</span>
                </div>`:a}

              ${this._config.show_level?t`<div class="level-chip ${P}" title="${e.thresholds(k,F)}">${S}</div>`:a}

              ${N?t`<div class="forecast-chip" title="Zambretti">
                <span class="ico">${N.icon}</span><span>${N.text}</span>
              </div>`:a}
            </div>
          </div>
        </div>
      </ha-card>
    `}_renderGaugeSvg(e,t,i,l){let n=this._config,r=(n.gauge_scale||"dual").toLowerCase(),o="inhg"===r?"inhg":"hpa",h="hpa"===o?n.scale_hpa_min:n.scale_inhg_min,c="hpa"===o?n.scale_hpa_max:n.scale_inhg_max,d=n.gauge_start_deg??-120,g=n.gauge_sweep_deg??240,u=(e,t,i)=>d+(clamp(e,t,i)-t)/(i-t)*g,p=e=>"hpa"===o?e:e/33.8638866667,m=u("hpa"===o?e:e/33.8638866667,h,c),f=Number.isFinite(n.gauge_width)?n.gauge_width:320,v=Number.isFinite(n.gauge_height)?n.gauge_height:210,$=Number.isFinite(n.gauge_offset_x)?n.gauge_offset_x:0,w=Number.isFinite(n.gauge_offset_y)?n.gauge_offset_y:0,b="dark"===l?"#bdbdbd":"#444444",_=b,x="dark"===l?"#ffffff":"#111111",y=(e,t)=>getComputedStyle(this).getPropertyValue(e)?.trim()||t,k=y("--error-color","#c5221f"),F=y("--success-color","#1e8e3e"),P=y("--secondary-text-color","dark"===l?"#9e9e9e":"#666666"),z=[],S=Math.max(0,Number(this._config.inhg_label_offset??12)),L=Math.max(0,Number(this._config.hpa_label_offset??12)),C=(e,t,i,l,n,r,o,d,g)=>{let p=Math.max(1,Math.round((t-e)/i));for(let m=0;m<=p;m++){let f=+(e+m*i).toFixed(6);if(f<e-1e-6||f>t+1e-6)continue;let v=1e-6>Math.abs((f-e)/l-Math.round((f-e)/l)),$=g(f),w=u($,h,c),x=(w-90)*Math.PI/180,y=120+n*Math.cos(x),k=150+n*Math.sin(x),F=120+(v?r:r-6)*Math.cos(x),P=150+(v?r:r-6)*Math.sin(x),C=v?2:1,H=v?1:.9,E=a;if(v){let j="outer"===d?105+S:76-L,N=120+j*Math.cos(x),I=150+j*Math.sin(x),W=Math.cos(x),M=Math.sin(x),B=W>.6?"end":W<-.6?"start":"middle",R=M>.6?"text-after-edge":M<-.6?"text-before-edge":"central";E=s`<text x="${N}" y="${I}" text-anchor="${B}" dominant-baseline="${R}"
            fill="${_}" font-size="11" font-weight="600" font-family="system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" opacity="0.98">${o(f)}</text>`}z.push(s`<g>
          <line x1="${y}" y1="${k}" x2="${F}" y2="${P}" vector-effect="non-scaling-stroke"
                stroke="${b}" stroke-width="${C}" opacity="${H}" />
          ${E}
        </g>`)}},H=!1!==this._config.dual_sync?this._config.scale_hpa_min/33.8638866667:this._config.scale_inhg_min,E=!1!==this._config.dual_sync?this._config.scale_hpa_max/33.8638866667:this._config.scale_inhg_max;if("dual"===r||"inhg"===r){let j="dual"===r?H:this._config.scale_inhg_min,N="dual"===r?E:this._config.scale_inhg_max;C(j,N,this._config.scale_inhg_minor,this._config.scale_inhg_major,103,89,e=>e.toFixed(1),"outer",e=>"hpa"===o?33.8638866667*e:e)}("dual"===r||"hpa"===r)&&C(this._config.scale_hpa_min,this._config.scale_hpa_max,this._config.scale_hpa_minor,this._config.scale_hpa_major,74,60,e=>e.toFixed(0),"inner",e=>"hpa"===o?e:e/33.8638866667);let I=(e,t,i,a)=>{let s=(a-90)*Math.PI/180;return[e+i*Math.cos(s),t+i*Math.sin(s)]},W=(e,t,i,a,s)=>{let[l,n]=I(e,t,i,a),[r,o]=I(e,t,i,s);return`M ${l} ${n} A ${i} ${i} 0 ${Math.abs(s-a)%360>180?1:0} ${s>=a?1:0} ${r} ${o}`},M=Math.max(4,Number(this._config.range_arc_width)||8),B=this._config.scale_hpa_min,R=this._config.scale_hpa_max,O=Math.max(B,Math.min(t,R)),G=Math.max(B,Math.min(i,R)),A=u(p(B),h,c),D=u(p(O),h,c),V=u(p(O),h,c),Z=u(p(G),h,c),T=u(p(G),h,c),J=u(p(R),h,c),U=(m-90)*Math.PI/180;return s`<svg width="${f}" height="${v}" viewBox="0 0 ${320} ${210}">
      <g transform="translate(${$} ${w})">
        <circle cx="${120}" cy="${150}" r="${85}" fill="${"dark"===l?"#ffffff":"#000000"}" opacity="0.08"></circle>

        ${!1!==this._config.show_range_arcs?s`<g stroke-linecap="round" fill="none">
          <path d="${W(120,150,95,A,D)}"  stroke="${k}"    stroke-width="${M}" opacity="0.28"></path>
          <path d="${W(120,150,95,V,Z)}"  stroke="${P}" stroke-width="${M}" opacity="0.28"></path>
          <path d="${W(120,150,95,T,J)}"    stroke="${F}"   stroke-width="${M}" opacity="0.28"></path>
        </g>`:a}

        <g>${z}</g>

        <g>
          <line x1="${120}" y1="${150}" x2="${120+78*Math.cos(U)}" y2="${150+78*Math.sin(U)}" stroke="${x}" stroke-width="2" vector-effect="non-scaling-stroke"></line>
          <circle cx="${120}" cy="${150}" r="3" fill="${x}"></circle>
        </g>
      </g>
    </svg>`}_handleMoreInfo(){let e=new Event("hass-more-info",{bubbles:!0,composed:!0});e.detail={entityId:this._config.entity},this.dispatchEvent(e)}static get styles(){return i`
      ha-card { padding: 16px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: center; }
      .right { display: grid; gap: 8px; }
      .header { font-weight: 600; opacity: 0.9; }
      .current-label { font-size: 0.75rem; letter-spacing: 0.08em; opacity: 0.7; }
      .current-value { display: flex; align-items: baseline; gap: 6px; font-variant-numeric: tabular-nums; flex-wrap: wrap; }
      .number { font-size: 1.8rem; line-height: 1.8rem; }
      .unit { font-size: 0.95rem; opacity: 0.8; }
      .chip { font-size: 0.7rem; padding: 2px 6px; border-radius: 8px; background: var(--chip-background, rgba(127,127,127,0.15)); }
      .meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
      .trend { display: flex; gap: 6px; align-items: center; opacity: 0.9; }
      .trend-icon.rising { color: var(--success-color, #1e8e3e); }
      .trend-icon.falling { color: var(--error-color, #c5221f); }
      .trend-icon.steady  { color: var(--secondary-text-color); }
      .level-chip { font-size: 0.75rem; padding: 2px 8px; border-radius: 999px; background: var(--ha-card-background, #1f1f1f);
        border: 1px solid var(--divider-color); text-transform: lowercase; opacity: 0.95; }
      .level-chip.low    { border-color: var(--error-color, #c5221f);   color: var(--error-color, #c5221f); }
      .level-chip.normal { border-color: var(--secondary-text-color);   color: var(--secondary-text-color); }
      .level-chip.high   { border-color: var(--success-color, #1e8e3e); color: var(--success-color, #1e8e3e); }
      .forecast-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; padding: 2px 8px; border-radius: 999px;
        border: 1px dashed var(--divider-color); opacity: 0.95; }
      .forecast-chip .ico { font-size: 1rem; }
      .level-border { border-left: 4px solid transparent; }
      .level-border.low    { border-left-color: var(--error-color, #c5221f); }
      .level-border.normal { border-left-color: var(--secondary-text-color); }
      .level-border.high   { border-left-color: var(--success-color, #1e8e3e); }
      .gauge { display: flex; justify-content: center; }
      .value.missing { color: var(--error-color); }
      @media (max-width: 680px) { .grid { grid-template-columns: 1fr; } }
    `}}customElements.get("barometric-pressure-card")||customElements.define("barometric-pressure-card",BarometricPressureCard);class BarometricPressureCardEditor extends e{static get properties(){return{hass:{},_config:{}}}setConfig(e){this._config={...e}}render(){if(!this.hass)return a;let e=resolveLang(this.hass,this._config),i=this._config||{};return t`
      <div class="form">
        <ha-entity-picker .hass=${this.hass} .value=${i.entity} label="Entita (sensor)" .includeDomains=${["sensor"]} .required=${!0} @value-changed=${e=>this._update("entity",e.detail.value)}></ha-entity-picker>
        <ha-textfield .value=${i.name||""} label="Název (volitelné)" @input=${e=>this._update("name",e.target.value)}></ha-textfield>

        <ha-select .value=${i.lang||"auto"} label="${e.ed_lang}" @selected=${e=>this._update("lang",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="auto">auto</mwc-list-item>
          <mwc-list-item value="cs">Čeština</mwc-list-item>
          <mwc-list-item value="en">English</mwc-list-item>
        </ha-select>

        <ha-select .value=${i.unit||"auto"} label="Jednotky zobrazení" @selected=${e=>this._update("unit",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="auto">auto (podle entity)</mwc-list-item>
          <mwc-list-item value="hPa">hPa</mwc-list-item>
          <mwc-list-item value="mmHg">mmHg</mwc-list-item>
          <mwc-list-item value="kPa">kPa</mwc-list-item>
          <mwc-list-item value="inHg">inHg</mwc-list-item>
        </ha-select>

        <ha-textfield type="number" .value=${String(Number.isFinite(i.decimals)?i.decimals:1)} label="Desetinná místa" @input=${e=>this._update("decimals",Number(e.target.value))}></ha-textfield>

        <div class="row"><ha-switch .checked=${!1!==i.show_trend} @change=${e=>this._update("show_trend",e.target.checked)}></ha-switch><div class="label">Zobrazit trend</div></div>
        <ha-textfield type="number" step="0.1" .value=${String(Number.isFinite(i.trend_threshold_hpa)?i.trend_threshold_hpa:.4)} label="Práh pro trend (hPa)" @input=${e=>this._update("trend_threshold_hpa",Number(e.target.value))}></ha-textfield>

        <div class="row"><ha-switch .checked=${!1!==i.normalize_msl} @change=${e=>this._update("normalize_msl",e.target.checked)}></ha-switch><div class="label">Normalizovat na hladinu moře (MSL)</div></div>
        <ha-entity-picker .hass=${this.hass} .value=${i.temperature_entity||""} label="Teplota pro MSL (volitelné)" .includeDomains=${["sensor","weather"]} @value-changed=${e=>this._update("temperature_entity",e.detail.value)}></ha-entity-picker>

        <ha-select .value=${i.threshold_unit||"auto"} label="${e.ed_threshold_unit}" @selected=${e=>this._update("threshold_unit",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="auto">auto</mwc-list-item>
          <mwc-list-item value="hpa">hPa</mwc-list-item>
          <mwc-list-item value="inhg">inHg</mwc-list-item>
        </ha-select>
        <div class="hint">${e.ed_threshold_hint}</div>
        <div class="grid2">
          <ha-textfield type="number" .value=${String(Number.isFinite(i.low_hpa)?i.low_hpa:1005)} label="Práh nízký (hPa, MSL)" @input=${e=>this._update("low_hpa",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" .value=${String(Number.isFinite(i.high_hpa)?i.high_hpa:1025)} label="Práh vysoký (hPa, MSL)" @input=${e=>this._update("high_hpa",Number(e.target.value))}></ha-textfield>
        </div>
        <div class="grid2">
          <ha-textfield type="number" step="0.01" .value=${String(Number.isFinite(i.low_inhg)?i.low_inhg:"")} label="Práh nízký (inHg, MSL)" @input=${e=>this._update("low_inhg",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" step="0.01" .value=${String(Number.isFinite(i.high_inhg)?i.high_inhg:"")} label="Práh vysoký (inHg, MSL)" @input=${e=>this._update("high_inhg",Number(e.target.value))}></ha-textfield>
        </div>

        <div class="sep"></div>

        <div class="row"><ha-switch .checked=${!1!==i.show_gauge} @change=${e=>this._update("show_gauge",e.target.checked)}></ha-switch><div class="label">Zobrazit číselník (gauge)</div></div>

        <ha-select .value=${i.gauge_scale||"dual"} label="Měřítko číselníku" @selected=${e=>this._update("gauge_scale",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="dual">Dual (inHg + hPa)</mwc-list-item>
          <mwc-list-item value="hPa">hPa</mwc-list-item>
          <mwc-list-item value="inHg">inHg</mwc-list-item>
        </ha-select>
        <div class="row"><ha-switch .checked=${!1!==i.dual_sync} @change=${e=>this._update("dual_sync",e.target.checked)}></ha-switch><div class="label">${e.ed_dual_sync}</div></div>

        <div class="grid2">
          <ha-textfield type="number" .value=${String(Number.isFinite(i.scale_inhg_min)?i.scale_inhg_min:28)} label="inHg min" @input=${e=>this._update("scale_inhg_min",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" .value=${String(Number.isFinite(i.scale_inhg_max)?i.scale_inhg_max:31)} label="inHg max" @input=${e=>this._update("scale_inhg_max",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" step="0.1" .value=${String(Number.isFinite(i.scale_inhg_major)?i.scale_inhg_major:.5)} label="inHg hlavní krok" @input=${e=>this._update("scale_inhg_major",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" step="0.1" .value=${String(Number.isFinite(i.scale_inhg_minor)?i.scale_inhg_minor:.1)} label="inHg jemný krok" @input=${e=>this._update("scale_inhg_minor",Number(e.target.value))}></ha-textfield>
        </div>

        <div class="grid2">
          <ha-textfield type="number" .value=${String(Number.isFinite(i.scale_hpa_min)?i.scale_hpa_min:980)} label="hPa min" @input=${e=>this._update("scale_hpa_min",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" .value=${String(Number.isFinite(i.scale_hpa_max)?i.scale_hpa_max:1040)} label="hPa max" @input=${e=>this._update("scale_hpa_max",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" .value=${String(Number.isFinite(i.scale_hpa_major)?i.scale_hpa_major:10)} label="hPa hlavní krok" @input=${e=>this._update("scale_hpa_major",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" .value=${String(Number.isFinite(i.scale_hpa_minor)?i.scale_hpa_minor:2)} label="hPa jemný krok" @input=${e=>this._update("scale_hpa_minor",Number(e.target.value))}></ha-textfield>
        </div>

        <div class="sep"></div>

        <ha-select .value=${i.contrast_mode||"auto"} label="Kontrast číselníku" @selected=${e=>this._update("contrast_mode",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="auto">auto</mwc-list-item>
          <mwc-list-item value="dark">tmavé pozadí (světlé rysky)</mwc-list-item>
          <mwc-list-item value="light">světlé pozadí (tmavé rysky)</mwc-list-item>
        </ha-select>

        <ha-select .value=${!1!==i.show_range_arcs?"on":"off"} label="Pásma (LOW/NORMAL/HIGH)" @selected=${e=>this._update("show_range_arcs","on"===e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="on">zapnuto</mwc-list-item>
          <mwc-list-item value="off">vypnuto</mwc-list-item>
        </ha-select>

        <ha-textfield type="number" .value=${String(Number.isFinite(i.range_arc_width)?i.range_arc_width:8)} label="Šířka pásma (px)" @input=${e=>this._update("range_arc_width",Number(e.target.value))}></ha-textfield>

        <div class="sep"></div>

        <!-- size + label offset controls -->
        <div class="grid2">
          <ha-textfield type="number" .value=${String(Number.isFinite(i.gauge_width)?i.gauge_width:320)} label="Šířka SVG (px)" @input=${e=>this._update("gauge_width",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" .value=${String(Number.isFinite(i.gauge_height)?i.gauge_height:210)} label="Výška SVG (px)" @input=${e=>this._update("gauge_height",Number(e.target.value))}></ha-textfield>
        </div>
        <ha-textfield type="number" .value=${String(Number.isFinite(i.inhg_label_offset)?i.inhg_label_offset:12)} label="Offset vnějších čísel inHg (px)" @input=${e=>this._update("inhg_label_offset",Number(e.target.value))}></ha-textfield>
        <ha-textfield type="number" .value=${String(Number.isFinite(i.hpa_label_offset)?i.hpa_label_offset:12)} label="Offset vnitřních čísel hPa (px)" @input=${e=>this._update("hpa_label_offset",Number(e.target.value))}></ha-textfield>

        <div class="grid2">
          <ha-textfield type="number" .value=${String(Number.isFinite(i.gauge_offset_x)?i.gauge_offset_x:0)} label="Posun SVG X (px)" @input=${e=>this._update("gauge_offset_x",Number(e.target.value))}></ha-textfield>
          <ha-textfield type="number" .value=${String(Number.isFinite(i.gauge_offset_y)?i.gauge_offset_y:0)} label="Posun SVG Y (px)" @input=${e=>this._update("gauge_offset_y",Number(e.target.value))}></ha-textfield>
        </div>

        <div class="sep"></div>

        <div class="row"><ha-switch .checked=${!1!==i.show_forecast} @change=${e=>this._update("show_forecast",e.target.checked)}></ha-switch><div class="label">Zobrazit „předpověď“</div></div>
        <ha-select .value=${i.forecast_mode||"zambretti"} label="Režim předpovědi" @selected=${e=>this._update("forecast_mode",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="zambretti">Zambretti (doporučeno)</mwc-list-item>
          <mwc-list-item value="simple">Jednoduchá heuristika</mwc-list-item>
        </ha-select>
        <ha-entity-picker .hass=${this.hass} .value=${i.wind_entity||""} label="Entita větru (volitelné)" .includeDomains=${["sensor","weather"]} @value-changed=${e=>this._update("wind_entity",e.detail.value)}></ha-entity-picker>
        <ha-select .value=${i.hemisphere||"north"} label="Polokoule" @selected=${e=>this._update("hemisphere",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="north">Severní</mwc-list-item><mwc-list-item value="south">Jižní</mwc-list-item>
        </ha-select>
        <ha-select .value=${i.season_mode||"auto"} label="Sezóna" @selected=${e=>this._update("season_mode",e.target.value)} @closed=${e=>e.stopPropagation()}>
          <mwc-list-item value="auto">auto</mwc-list-item>
          <mwc-list-item value="summer">léto</mwc-list-item>
          <mwc-list-item value="winter">zima</mwc-list-item>
        </ha-select>
      </div>
    `}_update(e,t){this._config={...this._config||{},[e]:t},fireEvent(this,"config-changed",{config:this._config})}static get styles(){return i`
    .form{display:grid;gap:12px}.row{display:flex;align-items:center;gap:12px}.label{font-size:.95rem;opacity:.9}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.sep{height:1px;background:var(--divider-color);margin:6px 0;opacity:.5}
    .hint{font-size:0.8rem;opacity:0.75;margin-top:-6px}
  `}}customElements.get("barometric-pressure-card-editor")||customElements.define("barometric-pressure-card-editor",BarometricPressureCardEditor),window.customCards=window.customCards||[],window.customCards.push({type:"barometric-pressure-card",name:"Barometric Pressure Card",description:"Barometrick\xfd tlak s MSL, trendem, p\xe1smy, č\xedseln\xedkem (smart outer labels) + i18n (CS/EN).",preview:!0}),console.info(`%c BAROMETRIC-PRESSURE-CARD %c v1.9.1 %c Načteno`,"background:#0b8043;color:white;padding:2px 6px;border-radius:4px 0 0 4px;","background:#e8f0fe;color:#174ea6;padding:2px 6px;","background:#e6f4ea;color:#0b8043;padding:2px 6px;border-radius:0 4px 4px 0;");