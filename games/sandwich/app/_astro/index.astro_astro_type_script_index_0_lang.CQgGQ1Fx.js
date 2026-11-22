const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/debugpanel.hmErAhyS.js","_astro/kept.BZRJuc8_.js"])))=>i.map(i=>d[i]);
import{A as e,C as t,D as n,F as r,I as i,L as a,M as o,N as s,O as c,P as l,R as u,S as d,T as f,_ as p,a as m,b as h,c as g,d as _,f as v,h as y,i as b,k as x,m as S,o as C,t as w,u as T,v as E,w as D,x as O,y as k,z as A}from"./kept.BZRJuc8_.js";import{a as j,c as M,i as N,n as P,o as F,r as I,t as ee,u as te}from"./share.Bqm9kowB.js";var L=1e3,R=1001,z=1002,B=1003,ne=1004,V=1005,H=1006,re=1007,ie=1008,ae=1009,oe=1010,se=1011,ce=1012,le=1013,U=1014,ue=1015,de=1016,fe=1017,W=1018,pe=1020,me=35902,he=35899,ge=1021,_e=1022,ve=1023,ye=1026,be=1027,G=1028,xe=1029,Se=1030,Ce=1031,we=1033,Te=33776,Ee=33777,K=33778,De=33779,q=35840,Oe=35841,ke=35842,Ae=35843,je=36196,Me=37492,Ne=37496,Pe=37488,Fe=37489,Ie=37490,Le=37491,Re=37808,ze=37809,Be=37810,Ve=37811,He=37812,Ue=37813,We=37814,Ge=37815,Ke=37816,J=37817,qe=37818,Je=37819,Ye=37820,Xe=37821,Ze=36492,Qe=36494,$e=36495,et=36283,tt=36284,nt=36285,rt=36286,it=2300,at=2301,ot=2302,st=2303,ct=2400,lt=2401,ut=2402,dt=3200,ft=3201,pt=`srgb`,mt=`srgb-linear`,ht=`linear`,gt=`srgb`,_t=7680,vt=35044,yt=2e3;function bt(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function xt(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function St(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function Ct(){let e=St(`canvas`);return e.style.display=`block`,e}var wt={};function Tt(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function Et(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function Y(...e){e=Et(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function Dt(...e){e=Et(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function Ot(...e){let t=e.join(` `);t in wt||(wt[t]=!0,Y(...e))}function kt(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var At={0:1,2:6,4:7,3:5,1:0,6:2,7:4,5:3},jt=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},Mt=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),Nt=1234567,Pt=Math.PI/180,Ft=180/Math.PI;function It(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Mt[e&255]+Mt[e>>8&255]+Mt[e>>16&255]+Mt[e>>24&255]+`-`+Mt[t&255]+Mt[t>>8&255]+`-`+Mt[t>>16&15|64]+Mt[t>>24&255]+`-`+Mt[n&63|128]+Mt[n>>8&255]+`-`+Mt[n>>16&255]+Mt[n>>24&255]+Mt[r&255]+Mt[r>>8&255]+Mt[r>>16&255]+Mt[r>>24&255]).toLowerCase()}function Lt(e,t,n){return Math.max(t,Math.min(n,e))}function Rt(e,t){return(e%t+t)%t}function zt(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function Bt(e,t,n){return e===t?0:(n-e)/(t-e)}function Vt(e,t,n){return(1-n)*e+n*t}function Ht(e,t,n,r){return Vt(e,t,1-Math.exp(-n*r))}function Ut(e,t=1){return t-Math.abs(Rt(e,t*2)-t)}function Wt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function Gt(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function Kt(e,t){return e+Math.floor(Math.random()*(t-e+1))}function qt(e,t){return e+Math.random()*(t-e)}function Jt(e){return e*(.5-Math.random())}function Yt(e){e!==void 0&&(Nt=e);let t=Nt+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Xt(e){return e*Pt}function Zt(e){return e*Ft}function Qt(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function $t(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function en(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function tn(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:Y(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function nn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return e/4294967295;case Uint16Array:return e/65535;case Uint8Array:case Uint8ClampedArray:return e/255;case Int32Array:return Math.max(e/2147483647,-1);case Int16Array:return Math.max(e/32767,-1);case Int8Array:return Math.max(e/127,-1);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}function rn(e,t){switch(t.constructor){case Float32Array:return e;case Uint32Array:return Math.round(e*4294967295);case Uint16Array:return Math.round(e*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(e*255);case Int32Array:return Math.round(e*2147483647);case Int16Array:return Math.round(e*32767);case Int8Array:return Math.round(e*127);default:throw Error(`THREE.MathUtils: Invalid component type.`)}}var an={DEG2RAD:Pt,RAD2DEG:Ft,generateUUID:It,clamp:Lt,euclideanModulo:Rt,mapLinear:zt,inverseLerp:Bt,lerp:Vt,damp:Ht,pingpong:Ut,smoothstep:Wt,smootherstep:Gt,randInt:Kt,randFloat:qt,randFloatSpread:Jt,seededRandom:Yt,degToRad:Xt,radToDeg:Zt,isPowerOfTwo:Qt,ceilPowerOfTwo:$t,floorPowerOfTwo:en,setQuaternionFromProperEuler:tn,normalize:rn,denormalize:nn},X=class e{static{e.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Lt(this.x,e.x,t.x),this.y=Lt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Lt(this.x,e,t),this.y=Lt(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},on=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:Y(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Lt(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Z=class e{static{e.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(cn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(cn.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Lt(this.x,e.x,t.x),this.y=Lt(this.y,e.y,t.y),this.z=Lt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Lt(this.x,e,t),this.y=Lt(this.y,e,t),this.z=Lt(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return sn.copy(this).projectOnVector(e),this.sub(sn)}reflect(e){return this.sub(sn.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},sn=new Z,cn=new on,ln=class e{static{e.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return Ot(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(un.makeScale(e,t)),this}rotate(e){return Ot(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(un.makeRotation(-e)),this}translate(e,t){return Ot(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(un.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},un=new ln,dn=new ln().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fn=new ln().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pn(){let e={enabled:!0,workingColorSpace:mt,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=hn(e.r),e.g=hn(e.g),e.b=hn(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=gn(e.r),e.g=gn(e.g),e.b=gn(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?ht:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,n){return Ot(`ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().`),e.workingToColorSpace(t,n)},toWorkingColorSpace:function(t,n){return Ot(`ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().`),e.colorSpaceToWorking(t,n)}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[mt]:{primaries:t,whitePoint:r,transfer:ht,toXYZ:dn,fromXYZ:fn,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:pt},outputColorSpaceConfig:{drawingBufferColorSpace:pt}},[pt]:{primaries:t,whitePoint:r,transfer:gt,toXYZ:dn,fromXYZ:fn,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:pt}}}),e}var mn=pn();function hn(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function gn(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var _n,vn=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_n===void 0&&(_n=St(`canvas`)),_n.width=e.width,_n.height=e.height;let t=_n.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=_n}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=St(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=hn(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(hn(t[e]/255)*255):t[e]=hn(t[e]);return{data:t,width:e.width,height:e.height}}return Y(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},yn=0,bn=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:yn++}),this.uuid=It(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width,t.height,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(xn(r[t].image)):e.push(xn(r[t]))}else e=xn(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function xn(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?vn.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(Y(`Texture: Unable to serialize Texture.`),{})}var Sn=0,Cn=new Z,wn=class e extends jt{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=R,i=R,a=H,o=ie,s=ve,c=ae,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Sn++}),this.uuid=It(),this.name=``,this.source=new bn(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new X(0,0),this.repeat=new X(1,1),this.center=new X(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ln,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Cn).x}get height(){return this.source.getSize(Cn).y}get depth(){return this.source.getSize(Cn).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){Y(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?Y(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case L:e.x-=Math.floor(e.x);break;case R:e.x=e.x<0?0:1;break;case z:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case L:e.y-=Math.floor(e.y);break;case R:e.y=e.y<0?0:1;break;case z:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};wn.DEFAULT_IMAGE=null,wn.DEFAULT_MAPPING=300,wn.DEFAULT_ANISOTROPY=1;var Tn=class e{static{e.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Lt(this.x,e.x,t.x),this.y=Lt(this.y,e.y,t.y),this.z=Lt(this.z,e.z,t.z),this.w=Lt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Lt(this.x,e,t),this.y=Lt(this.y,e,t),this.z=Lt(this.z,e,t),this.w=Lt(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Lt(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},En=class extends jt{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:H,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new Tn(0,0,e,t),this.scissorTest=!1,this.viewport=new Tn(0,0,e,t),this.textures=[];let r=new wn({width:e,height:t,depth:n.depth}),i=n.count;for(let e=0;e<i;e++)this.textures[e]=r.clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:H,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new bn(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},Dn=class extends En{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},On=class extends wn{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=B,this.minFilter=B,this.wrapR=R,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},kn=class extends wn{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=B,this.minFilter=B,this.wrapR=R,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},An=class e{static{e.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/jn.setFromMatrixColumn(e,0).length(),i=1/jn.setFromMatrixColumn(e,1).length(),a=1/jn.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Nn,e,Pn)}lookAt(e,t,n){let r=this.elements;return Ln.subVectors(e,t),Ln.lengthSq()===0&&(Ln.z=1),Ln.normalize(),Fn.crossVectors(n,Ln),Fn.lengthSq()===0&&(Math.abs(n.z)===1?Ln.x+=1e-4:Ln.z+=1e-4,Ln.normalize(),Fn.crossVectors(n,Ln)),Fn.normalize(),In.crossVectors(Ln,Fn),r[0]=Fn.x,r[4]=In.x,r[8]=Ln.x,r[1]=Fn.y,r[5]=In.y,r[9]=Ln.y,r[2]=Fn.z,r[6]=In.z,r[10]=Ln.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],M=r[14],N=r[3],P=r[7],F=r[11],I=r[15];return i[0]=a*x+o*T+s*k+c*N,i[4]=a*S+o*E+s*A+c*P,i[8]=a*C+o*D+s*j+c*F,i[12]=a*w+o*O+s*M+c*I,i[1]=l*x+u*T+d*k+f*N,i[5]=l*S+u*E+d*A+f*P,i[9]=l*C+u*D+d*j+f*F,i[13]=l*w+u*O+d*M+f*I,i[2]=p*x+m*T+h*k+g*N,i[6]=p*S+m*E+h*A+g*P,i[10]=p*C+m*D+h*j+g*F,i[14]=p*w+m*O+h*M+g*I,i[3]=_*x+v*T+y*k+b*N,i[7]=_*S+v*E+y*A+b*P,i[11]=_*C+v*D+y*j+b*F,i[15]=_*w+v*O+y*M+b*I,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=jn.set(r[0],r[1],r[2]).length(),o=jn.set(r[4],r[5],r[6]).length(),s=jn.set(r[8],r[9],r[10]).length();i<0&&(a=-a),Mn.copy(this);let c=1/a,l=1/o,u=1/s;return Mn.elements[0]*=c,Mn.elements[1]*=c,Mn.elements[2]*=c,Mn.elements[4]*=l,Mn.elements[5]*=l,Mn.elements[6]*=l,Mn.elements[8]*=u,Mn.elements[9]*=u,Mn.elements[10]*=u,t.setFromRotationMatrix(Mn),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=yt,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=yt,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},jn=new Z,Mn=new An,Nn=new Z(0,0,0),Pn=new Z(1,1,1),Fn=new Z,In=new Z,Ln=new Z,Rn=new An,zn=new on,Bn=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(Lt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-Lt(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(Lt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-Lt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(Lt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-Lt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:Y(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Rn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Rn,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return zn.setFromEuler(this),this.setFromQuaternion(zn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Bn.DEFAULT_ORDER=`XYZ`;var Vn=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},Hn=0,Un=new Z,Wn=new on,Gn=new An,Kn=new Z,qn=new Z,Jn=new Z,Yn=new on,Xn=new Z(1,0,0),Zn=new Z(0,1,0),Qn=new Z(0,0,1),$n={type:`added`},er={type:`removed`},tr={type:`childadded`,child:null},nr={type:`childremoved`,child:null},rr=class e extends jt{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hn++}),this.uuid=It(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new Z,n=new Bn,r=new on,i=new Z(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new An},normalMatrix:{value:new ln}}),this.matrix=new An,this.matrixWorld=new An,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Vn,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Wn.setFromAxisAngle(e,t),this.quaternion.multiply(Wn),this}rotateOnWorldAxis(e,t){return Wn.setFromAxisAngle(e,t),this.quaternion.premultiply(Wn),this}rotateX(e){return this.rotateOnAxis(Xn,e)}rotateY(e){return this.rotateOnAxis(Zn,e)}rotateZ(e){return this.rotateOnAxis(Qn,e)}translateOnAxis(e,t){return Un.copy(e).applyQuaternion(this.quaternion),this.position.add(Un.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Xn,e)}translateY(e){return this.translateOnAxis(Zn,e)}translateZ(e){return this.translateOnAxis(Qn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Gn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Kn.copy(e):Kn.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),qn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Gn.lookAt(qn,Kn,this.up):Gn.lookAt(Kn,qn,this.up),this.quaternion.setFromRotationMatrix(Gn),r&&(Gn.extractRotation(r.matrixWorld),Wn.setFromRotationMatrix(Gn),this.quaternion.premultiply(Wn.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(Dt(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent($n),tr.child=e,this.dispatchEvent(tr),tr.child=null):Dt(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(er),nr.child=e,this.dispatchEvent(nr),nr.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Gn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Gn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Gn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent($n),tr.child=e,this.dispatchEvent(tr),tr.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qn,e,Jn),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qn,Yn,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};rr.DEFAULT_UP=new Z(0,1,0),rr.DEFAULT_MATRIX_AUTO_UPDATE=!0,rr.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ir=class extends rr{constructor(){super(),this.isGroup=!0,this.type=`Group`}},ar={type:`move`},or=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ir,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ir,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ir,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.rotation,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ar)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ir;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},sr={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},cr={h:0,s:0,l:0},lr={h:0,s:0,l:0};function ur(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var dr=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=pt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,mn.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=mn.workingColorSpace){return this.r=e,this.g=t,this.b=n,mn.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=mn.workingColorSpace){if(e=Rt(e,1),t=Lt(t,0,1),n=Lt(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=ur(i,r,e+1/3),this.g=ur(i,r,e),this.b=ur(i,r,e-1/3)}return mn.colorSpaceToWorking(this,r),this}setStyle(e,t=pt){function n(t){t!==void 0&&parseFloat(t)<1&&Y(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseInt(i[1],10))/100,Math.min(100,parseInt(i[2],10))/100,Math.min(100,parseInt(i[3],10))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:Y(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);Y(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=pt){let n=sr[e.toLowerCase()];return n===void 0?Y(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hn(e.r),this.g=hn(e.g),this.b=hn(e.b),this}copyLinearToSRGB(e){return this.r=gn(e.r),this.g=gn(e.g),this.b=gn(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=pt){return mn.workingToColorSpace(fr.copy(this),e),Math.round(Lt(fr.r*255,0,255))*65536+Math.round(Lt(fr.g*255,0,255))*256+Math.round(Lt(fr.b*255,0,255))}getHexString(e=pt){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=mn.workingColorSpace){mn.workingToColorSpace(fr.copy(this),t);let n=fr.r,r=fr.g,i=fr.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=mn.workingColorSpace){return mn.workingToColorSpace(fr.copy(this),t),e.r=fr.r,e.g=fr.g,e.b=fr.b,e}getStyle(e=pt){mn.workingToColorSpace(fr.copy(this),e);let t=fr.r,n=fr.g,r=fr.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(cr),this.setHSL(cr.h+e,cr.s+t,cr.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(cr),e.getHSL(lr);let n=Vt(cr.h,lr.h,t),r=Vt(cr.s,lr.s,t),i=Vt(cr.l,lr.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},fr=new dr;dr.NAMES=sr;var pr=class extends rr{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Bn,this.environmentIntensity=1,this.environmentRotation=new Bn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},mr=new Z,hr=new Z,gr=new Z,_r=new Z,vr=new Z,yr=new Z,br=new Z,xr=new Z,Sr=new Z,Cr=new Z,wr=new Tn,Tr=new Tn,Er=new Tn,Dr=class e{constructor(e=new Z,t=new Z,n=new Z){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),mr.subVectors(e,t),r.cross(mr);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){mr.subVectors(r,t),hr.subVectors(n,t),gr.subVectors(e,t);let a=mr.dot(mr),o=mr.dot(hr),s=mr.dot(gr),c=hr.dot(hr),l=hr.dot(gr),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,_r)!==null&&_r.x>=0&&_r.y>=0&&_r.x+_r.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,_r)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,_r.x),s.addScaledVector(a,_r.y),s.addScaledVector(o,_r.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return wr.setScalar(0),Tr.setScalar(0),Er.setScalar(0),wr.fromBufferAttribute(e,t),Tr.fromBufferAttribute(e,n),Er.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(wr,i.x),a.addScaledVector(Tr,i.y),a.addScaledVector(Er,i.z),a}static isFrontFacing(e,t,n,r){return mr.subVectors(n,t),hr.subVectors(e,t),mr.cross(hr).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mr.subVectors(this.c,this.b),hr.subVectors(this.a,this.b),mr.cross(hr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;vr.subVectors(r,n),yr.subVectors(i,n),xr.subVectors(e,n);let s=vr.dot(xr),c=yr.dot(xr);if(s<=0&&c<=0)return t.copy(n);Sr.subVectors(e,r);let l=vr.dot(Sr),u=yr.dot(Sr);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0)return a=s/(s-l),t.copy(n).addScaledVector(vr,a);Cr.subVectors(e,i);let f=vr.dot(Cr),p=yr.dot(Cr);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(yr,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return br.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(br,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(vr,a).addScaledVector(yr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Or=class{constructor(e=new Z(1/0,1/0,1/0),t=new Z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ar.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ar.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Ar.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,Ar):Ar.fromBufferAttribute(r,t),Ar.applyMatrix4(e.matrixWorld),this.expandByPoint(Ar);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),jr.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),jr.copy(e.boundingBox)),jr.applyMatrix4(e.matrixWorld),this.union(jr)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ar),Ar.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Rr),zr.subVectors(this.max,Rr),Mr.subVectors(e.a,Rr),Nr.subVectors(e.b,Rr),Pr.subVectors(e.c,Rr),Fr.subVectors(Nr,Mr),Ir.subVectors(Pr,Nr),Lr.subVectors(Mr,Pr);let t=[0,-Fr.z,Fr.y,0,-Ir.z,Ir.y,0,-Lr.z,Lr.y,Fr.z,0,-Fr.x,Ir.z,0,-Ir.x,Lr.z,0,-Lr.x,-Fr.y,Fr.x,0,-Ir.y,Ir.x,0,-Lr.y,Lr.x,0];return!Hr(t,Mr,Nr,Pr,zr)||(t=[1,0,0,0,1,0,0,0,1],!Hr(t,Mr,Nr,Pr,zr))?!1:(Br.crossVectors(Fr,Ir),t=[Br.x,Br.y,Br.z],Hr(t,Mr,Nr,Pr,zr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ar).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ar).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(kr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),kr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),kr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),kr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),kr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),kr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),kr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),kr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(kr)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},kr=[new Z,new Z,new Z,new Z,new Z,new Z,new Z,new Z],Ar=new Z,jr=new Or,Mr=new Z,Nr=new Z,Pr=new Z,Fr=new Z,Ir=new Z,Lr=new Z,Rr=new Z,zr=new Z,Br=new Z,Vr=new Z;function Hr(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){Vr.fromArray(e,a);let o=i.x*Math.abs(Vr.x)+i.y*Math.abs(Vr.y)+i.z*Math.abs(Vr.z),s=t.dot(Vr),c=n.dot(Vr),l=r.dot(Vr);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Ur=new Z,Wr=new X,Gr=0,Kr=class extends jt{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Gr++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=vt,this.updateRanges=[],this.gpuType=ue,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Wr.fromBufferAttribute(this,t),Wr.applyMatrix3(e),this.setXY(t,Wr.x,Wr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.applyMatrix3(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.applyMatrix4(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.applyNormalMatrix(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ur.fromBufferAttribute(this,t),Ur.transformDirection(e),this.setXYZ(t,Ur.x,Ur.y,Ur.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=nn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=nn(t,this.array)),t}setX(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=nn(t,this.array)),t}setY(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=nn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=nn(t,this.array)),t}setW(e,t){return this.normalized&&(t=rn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=rn(t,this.array),n=rn(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=rn(t,this.array),n=rn(n,this.array),r=rn(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=rn(t,this.array),n=rn(n,this.array),r=rn(r,this.array),i=rn(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}},qr=class extends Kr{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Jr=class extends Kr{constructor(e,t,n){super(new Uint32Array(e),t,n)}},Yr=class extends Kr{constructor(e,t,n){super(new Float32Array(e),t,n)}},Xr=new Or,Zr=new Z,Qr=new Z,$r=class{constructor(e=new Z,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?Xr.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zr.subVectors(e,this.center);let t=Zr.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Zr,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zr.copy(e.center).add(Qr)),this.expandByPoint(Zr.copy(e.center).sub(Qr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},ei=0,ti=new An,ni=new rr,ri=new Z,ii=new Or,ai=new Or,oi=new Z,si=class e extends jt{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ei++}),this.uuid=It(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(bt(e)?Jr:qr)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new ln().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return ti.makeRotationFromQuaternion(e),this.applyMatrix4(ti),this}rotateX(e){return ti.makeRotationX(e),this.applyMatrix4(ti),this}rotateY(e){return ti.makeRotationY(e),this.applyMatrix4(ti),this}rotateZ(e){return ti.makeRotationZ(e),this.applyMatrix4(ti),this}translate(e,t,n){return ti.makeTranslation(e,t,n),this.applyMatrix4(ti),this}scale(e,t,n){return ti.makeScale(e,t,n),this.applyMatrix4(ti),this}lookAt(e){return ni.lookAt(e),ni.updateMatrix(),this.applyMatrix4(ni.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ri).negate(),this.translate(ri.x,ri.y,ri.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new Yr(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&Y(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Or);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)Dt(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new Z(-1/0,-1/0,-1/0),new Z(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ii.setFromBufferAttribute(n),this.morphTargetsRelative?(oi.addVectors(this.boundingBox.min,ii.min),this.boundingBox.expandByPoint(oi),oi.addVectors(this.boundingBox.max,ii.max),this.boundingBox.expandByPoint(oi)):(this.boundingBox.expandByPoint(ii.min),this.boundingBox.expandByPoint(ii.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Dt(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $r);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)Dt(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new Z,1/0);else if(e){let n=this.boundingSphere.center;if(ii.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];ai.setFromBufferAttribute(n),this.morphTargetsRelative?(oi.addVectors(ii.min,ai.min),ii.expandByPoint(oi),oi.addVectors(ii.max,ai.max),ii.expandByPoint(oi)):(ii.expandByPoint(ai.min),ii.expandByPoint(ai.max))}ii.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)oi.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(oi));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)oi.fromBufferAttribute(a,t),o&&(ri.fromBufferAttribute(e,t),oi.add(ri)),r=Math.max(r,n.distanceToSquared(oi))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&Dt(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Dt(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new Kr(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[];for(let e=0;e<n.count;e++)o[e]=new Z,s[e]=new Z;let c=new Z,l=new Z,u=new Z,d=new X,f=new X,p=new X,m=new Z,h=new Z;function g(e,t,r){c.fromBufferAttribute(n,e),l.fromBufferAttribute(n,t),u.fromBufferAttribute(n,r),d.fromBufferAttribute(i,e),f.fromBufferAttribute(i,t),p.fromBufferAttribute(i,r),l.sub(c),u.sub(c),f.sub(d),p.sub(d);let a=1/(f.x*p.y-p.x*f.y);isFinite(a)&&(m.copy(l).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(a),h.copy(u).multiplyScalar(f.x).addScaledVector(l,-p.x).multiplyScalar(a),o[e].add(m),o[t].add(m),o[r].add(m),s[e].add(h),s[t].add(h),s[r].add(h))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)g(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let v=new Z,y=new Z,b=new Z,x=new Z;function S(e){b.fromBufferAttribute(r,e),x.copy(b);let t=o[e];v.copy(t),v.sub(b.multiplyScalar(b.dot(t))).normalize(),y.crossVectors(x,t);let n=y.dot(s[e])<0?-1:1;a.setXYZW(e,v.x,v.y,v.z,n)}for(let t=0,n=_.length;t<n;++t){let n=_[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)S(e.getX(t+0)),S(e.getX(t+1)),S(e.getX(t+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new Kr(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new Z,i=new Z,a=new Z,o=new Z,s=new Z,c=new Z,l=new Z,u=new Z;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)oi.fromBufferAttribute(e,t),oi.normalize(),e.setXYZ(t,oi.x,oi.y,oi.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new Kr(a,r,i)}if(this.index===null)return Y(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},ci=new Z,li=new Z,ui=new ln,di=class{constructor(e=new Z(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=ci.subVectors(n,t).cross(li.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(ci),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ui.getNormalMatrix(e),r=this.coplanarPoint(ci).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},fi=0,pi=class extends jt{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fi++}),this.uuid=It(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new dr(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_t,this.stencilZFail=_t,this.stencilZPass=_t,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){Y(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?Y(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new dr().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new di().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new X().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new X().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},mi=new Z,hi=new Z,gi=new Z,_i=new Z,vi=class{constructor(e=new Z,t=new Z(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,mi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=mi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(mi.copy(this.origin).addScaledVector(this.direction,t),mi.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){hi.copy(e).add(t).multiplyScalar(.5),gi.copy(t).sub(e).normalize(),_i.copy(this.origin).sub(hi);let i=e.distanceTo(t)*.5,a=-this.direction.dot(gi),o=_i.dot(this.direction),s=-_i.dot(gi),c=_i.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(hi).addScaledVector(gi,d),f}intersectSphere(e,t){if(e.radius<0)return null;mi.subVectors(e.center,this.origin);let n=mi.dot(this.direction),r=mi.dot(mi)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,mi)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,M,N;if(y>=b&&y>=x?(w=s,D=u,A=p,N=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,M=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,M=_)):b>=x?(w=c,D=d,A=m,N=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,M=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,M=v)):(w=l,D=f,A=h,N=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,M=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,M=g)),w===0)return null;let P=S/w,F=C/w,I=1/w,ee=T-P*D,te=E-F*D,L=O-P*A,R=k-F*A,z=j-P*N,B=M-F*N,ne=z*R-B*L,V=ee*B-te*z,H=L*te-R*ee;if(r){if(ne<0||V<0||H<0)return null}else if((ne<0||V<0||H<0)&&(ne>0||V>0||H>0))return null;let re=ne+V+H;if(re===0)return null;let ie=I*(ne*D+V*A+H*N);return(re>0?ie<0:ie>0)?null:this.at(ie/re,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},yi=class extends pi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new dr(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},bi=new An,xi=new vi,Si=new $r,Ci=new Z,wi=new Z,Ti=new Z,Ei=new Z,Di=new Z,Oi=new Z,ki=new Z,Ai=new Z,ji=class extends rr{constructor(e=new si,t=new yi){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Oi.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Di.fromBufferAttribute(s,e),a?Oi.addScaledVector(Di,r):Oi.addScaledVector(Di.sub(t),r))}t.add(Oi)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Si.copy(n.boundingSphere),Si.applyMatrix4(i),xi.copy(e.ray).recast(e.near),Si.containsPoint(xi.origin)===!1&&(xi.intersectSphere(Si,Ci)===null||xi.origin.distanceToSquared(Ci)>(e.far-e.near)**2)||(bi.copy(i).invert(),xi.copy(e.ray).applyMatrix4(bi),(n.boundingBox===null||xi.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,xi)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=Ni(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=Ni(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=Ni(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=Ni(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Mi(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;Ai.copy(s),Ai.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(Ai);return l<n.near||l>n.far?null:{distance:l,point:Ai.clone(),object:e}}function Ni(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,wi),e.getVertexPosition(c,Ti),e.getVertexPosition(l,Ei);let u=Mi(e,t,n,r,wi,Ti,Ei,ki);if(u){let e=new Z;Dr.getBarycoord(ki,wi,Ti,Ei,e),i&&(u.uv=Dr.getInterpolatedAttribute(i,s,c,l,e,new X)),a&&(u.uv1=Dr.getInterpolatedAttribute(a,s,c,l,e,new X)),o&&(u.normal=Dr.getInterpolatedAttribute(o,s,c,l,e,new Z),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new Z,materialIndex:0};Dr.getNormal(wi,Ti,Ei,t.normal),u.face=t,u.barycoord=e}return u}var Pi=class extends wn{constructor(e=null,t=1,n=1,r,i,a,o,s,c=B,l=B,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Fi=new $r,Ii=new X(.5,.5),Li=new Z,Ri=class{constructor(e=new di,t=new di,n=new di,r=new di,i=new di,a=new di){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=yt,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fi)}intersectsSprite(e){return Fi.center.set(0,0,0),Fi.radius=.7071067811865476+Ii.distanceTo(e.center),Fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fi)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Li.x=r.normal.x>0?e.max.x:e.min.x,Li.y=r.normal.y>0?e.max.y:e.min.y,Li.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Li)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},zi=class extends wn{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Bi=class extends wn{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Vi=class extends wn{constructor(e,t,n=U,r,i,a,o=B,s=B,c,l=ye,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new bn(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Hi=class extends Vi{constructor(e,t=U,n=301,r,i,a=B,o=B,s,c=ye){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Ui=class extends wn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Wi=class e extends si{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new Yr(c,3)),this.setAttribute(`normal`,new Yr(l,3)),this.setAttribute(`uv`,new Yr(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new Z;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Gi=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Y(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new X:new Z);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new Z,r=[],i=[],a=[],o=new Z,s=new An;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new Z)}i[0]=new Z,a[0]=new Z;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(Lt(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(Lt(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}},Ki=class extends Gi{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new X){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},qi=class extends Ki{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Ji(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var Yi=new Z,Xi=new Z,Zi=new Ji,Qi=new Ji,$i=new Ji,ea=class extends Gi{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new Z){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(Xi.subVectors(r[0],r[1]).add(r[0]),c=Xi);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:(Yi.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=Yi),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),Zi.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),Qi.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),$i.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(Zi.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),Qi.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),$i.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(Zi.calc(s),Qi.calc(s),$i.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new Z().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function ta(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function na(e,t){let n=1-e;return n*n*t}function ra(e,t){return 2*(1-e)*e*t}function ia(e,t){return e*e*t}function aa(e,t,n,r){return na(e,t)+ra(e,n)+ia(e,r)}function oa(e,t){let n=1-e;return n*n*n*t}function sa(e,t){let n=1-e;return 3*n*n*e*t}function ca(e,t){return 3*(1-e)*e*e*t}function la(e,t){return e*e*e*t}function ua(e,t,n,r,i){return oa(e,t)+sa(e,n)+ca(e,r)+la(e,i)}var da=class extends Gi{constructor(e=new X,t=new X,n=new X,r=new X){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new X){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(ua(e,r.x,i.x,a.x,o.x),ua(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},fa=class extends Gi{constructor(e=new Z,t=new Z,n=new Z,r=new Z){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new Z){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(ua(e,r.x,i.x,a.x,o.x),ua(e,r.y,i.y,a.y,o.y),ua(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},pa=class extends Gi{constructor(e=new X,t=new X){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new X){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new X){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ma=class extends Gi{constructor(e=new Z,t=new Z){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new Z){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Z){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ha=class extends Gi{constructor(e=new X,t=new X,n=new X){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new X){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(aa(e,r.x,i.x,a.x),aa(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},ga=class extends Gi{constructor(e=new Z,t=new Z,n=new Z){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Z){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(aa(e,r.x,i.x,a.x),aa(e,r.y,i.y,a.y),aa(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},_a=class extends Gi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new X){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(ta(o,s.x,c.x,l.x,u.x),ta(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new X().fromArray(n))}return this}},va=Object.freeze({__proto__:null,ArcCurve:qi,CatmullRomCurve3:ea,CubicBezierCurve:da,CubicBezierCurve3:fa,EllipseCurve:Ki,LineCurve:pa,LineCurve3:ma,QuadraticBezierCurve:ha,QuadraticBezierCurve3:ga,SplineCurve:_a}),ya=class extends Gi{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new va[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new va[n.type]().fromJSON(n))}return this}},ba=class extends ya{constructor(e){super(),this.type=`Path`,this.currentPoint=new X,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){let n=new pa(this.currentPoint.clone(),new X(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,r){let i=new ha(this.currentPoint.clone(),new X(e,t),new X(n,r));return this.curves.push(i),this.currentPoint.set(n,r),this}bezierCurveTo(e,t,n,r,i,a){let o=new da(this.currentPoint.clone(),new X(e,t),new X(n,r),new X(i,a));return this.curves.push(o),this.currentPoint.set(i,a),this}splineThru(e){let t=new _a([this.currentPoint.clone()].concat(e));return this.curves.push(t),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,r,i,a){let o=this.currentPoint.x,s=this.currentPoint.y;return this.absarc(e+o,t+s,n,r,i,a),this}absarc(e,t,n,r,i,a){return this.absellipse(e,t,n,n,r,i,a),this}ellipse(e,t,n,r,i,a,o,s){let c=this.currentPoint.x,l=this.currentPoint.y;return this.absellipse(e+c,t+l,n,r,i,a,o,s),this}absellipse(e,t,n,r,i,a,o,s){let c=new Ki(e,t,n,r,i,a,o,s);if(this.curves.length>0){let e=c.getPoint(0);e.equals(this.currentPoint)||this.lineTo(e.x,e.y)}this.curves.push(c);let l=c.getPoint(1);return this.currentPoint.copy(l),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){let e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}},xa=class extends ba{constructor(e){super(e),this.uuid=It(),this.type=`Shape`,this.holes=[]}getPointsHoles(e){let t=[];for(let n=0,r=this.holes.length;n<r;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){let n=this.holes[t];e.holes.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){let n=e.holes[t];this.holes.push(new ba().fromJSON(n))}return this}};function Sa(e,t,n=2){let r=t&&t.length,i=r?t[0]*n:e.length,a=Ca(e,0,i,n,!0),o=[];if(!a||a.next===a.prev)return o;let s,c,l;if(r&&(a=Aa(e,t,a,n)),e.length>80*n){s=e[0],c=e[1];let t=s,r=c;for(let a=n;a<i;a+=n){let n=e[a],i=e[a+1];n<s&&(s=n),i<c&&(c=i),n>t&&(t=n),i>r&&(r=i)}l=Math.max(t-s,r-c),l=l===0?0:32767/l}return Ta(a,o,n,s,c,l,0),o}function Ca(e,t,n,r,i){let a;if(i===eo(e,t,n,r)>0)for(let i=t;i<n;i+=r)a=Za(i/r|0,e[i],e[i+1],a);else for(let i=n-r;i>=t;i-=r)a=Za(i/r|0,e[i],e[i+1],a);return a&&Ua(a,a.next)&&(Qa(a),a=a.next),a}function wa(e,t){if(!e)return e;t||=e;let n=e,r;do if(r=!1,!n.steiner&&(Ua(n,n.next)||Ha(n.prev,n,n.next)===0)){if(Qa(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function Ta(e,t,n,r,i,a,o){if(!e)return;!o&&a&&Fa(e,r,i,a);let s=e;for(;e.prev!==e.next;){let c=e.prev,l=e.next;if(a?Da(e,r,i,a):Ea(e))t.push(c.i,e.i,l.i),Qa(e),e=l.next,s=l.next;else if(e=l,e===s){o?o===1?(e=Oa(wa(e),t),Ta(e,t,n,r,i,a,2)):o===2&&ka(e,t,n,r,i,a):Ta(wa(e),t,n,r,i,a,1);break}}}function Ea(e){let t=e.prev,n=e,r=e.next;if(Ha(t,n,r)>=0)return!1;let i=t.x,a=n.x,o=r.x,s=t.y,c=n.y,l=r.y,u=Math.min(i,a,o),d=Math.min(s,c,l),f=Math.max(i,a,o),p=Math.max(s,c,l),m=r.next;for(;m!==t;){if(m.x>=u&&m.x<=f&&m.y>=d&&m.y<=p&&Ba(i,s,a,c,o,l,m.x,m.y)&&Ha(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Da(e,t,n,r){let i=e.prev,a=e,o=e.next;if(Ha(i,a,o)>=0)return!1;let s=i.x,c=a.x,l=o.x,u=i.y,d=a.y,f=o.y,p=Math.min(s,c,l),m=Math.min(u,d,f),h=Math.max(s,c,l),g=Math.max(u,d,f),_=La(p,m,t,n,r),v=La(h,g,t,n,r),y=e.prevZ,b=e.nextZ;for(;y&&y.z>=_&&b&&b.z<=v;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ba(s,u,c,d,l,f,y.x,y.y)&&Ha(y.prev,y,y.next)>=0||(y=y.prevZ,b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ba(s,u,c,d,l,f,b.x,b.y)&&Ha(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;y&&y.z>=_;){if(y.x>=p&&y.x<=h&&y.y>=m&&y.y<=g&&y!==i&&y!==o&&Ba(s,u,c,d,l,f,y.x,y.y)&&Ha(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;b&&b.z<=v;){if(b.x>=p&&b.x<=h&&b.y>=m&&b.y<=g&&b!==i&&b!==o&&Ba(s,u,c,d,l,f,b.x,b.y)&&Ha(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Oa(e,t){let n=e;do{let r=n.prev,i=n.next.next;!Ua(r,i)&&Wa(r,n,n.next,i)&&Ja(r,i)&&Ja(i,r)&&(t.push(r.i,n.i,i.i),Qa(n),Qa(n.next),n=e=i),n=n.next}while(n!==e);return wa(n)}function ka(e,t,n,r,i,a){let o=e;do{let e=o.next.next;for(;e!==o.prev;){if(o.i!==e.i&&Va(o,e)){let s=Xa(o,e);o=wa(o,o.next),s=wa(s,s.next),Ta(o,t,n,r,i,a,0),Ta(s,t,n,r,i,a,0);return}e=e.next}o=o.next}while(o!==e)}function Aa(e,t,n,r){let i=[];for(let n=0,a=t.length;n<a;n++){let o=Ca(e,t[n]*r,n<a-1?t[n+1]*r:e.length,r,!1);o===o.next&&(o.steiner=!0),i.push(Ra(o))}i.sort(ja);for(let e=0;e<i.length;e++)n=Ma(i[e],n);return n}function ja(e,t){let n=e.x-t.x;return n===0&&(n=e.y-t.y,n===0&&(n=(e.next.y-e.y)/(e.next.x-e.x)-(t.next.y-t.y)/(t.next.x-t.x))),n}function Ma(e,t){let n=Na(e,t);if(!n)return t;let r=Xa(n,e);return wa(r,r.next),wa(n,n.next)}function Na(e,t){let n=t,r=e.x,i=e.y,a=-1/0,o;if(Ua(e,n))return n;do{if(Ua(e,n.next))return n.next;if(i<=n.y&&i>=n.next.y&&n.next.y!==n.y){let e=n.x+(i-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(e<=r&&e>a&&(a=e,o=n.x<n.next.x?n:n.next,e===r))return o}n=n.next}while(n!==t);if(!o)return null;let s=o,c=o.x,l=o.y,u=1/0;n=o;do{if(r>=n.x&&n.x>=c&&r!==n.x&&za(i<l?r:a,i,c,l,i<l?a:r,i,n.x,n.y)){let t=Math.abs(i-n.y)/(r-n.x);Ja(n,e)&&(t<u||t===u&&(n.x>o.x||n.x===o.x&&Pa(o,n)))&&(o=n,u=t)}n=n.next}while(n!==s);return o}function Pa(e,t){return Ha(e.prev,e,t.prev)<0&&Ha(t.next,e,e.next)<0}function Fa(e,t,n,r){let i=e;do i.z===0&&(i.z=La(i.x,i.y,t,n,r)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==e);i.prevZ.nextZ=null,i.prevZ=null,Ia(i)}function Ia(e){let t,n=1;do{let r=e,i;e=null;let a=null;for(t=0;r;){t++;let o=r,s=0;for(let e=0;e<n&&(s++,o=o.nextZ,o);e++);let c=n;for(;s>0||c>0&&o;)s!==0&&(c===0||!o||r.z<=o.z)?(i=r,r=r.nextZ,s--):(i=o,o=o.nextZ,c--),a?a.nextZ=i:e=i,i.prevZ=a,a=i;r=o}a.nextZ=null,n*=2}while(t>1);return e}function La(e,t,n,r,i){return e=(e-n)*i|0,t=(t-r)*i|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Ra(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function za(e,t,n,r,i,a,o,s){return(i-o)*(t-s)>=(e-o)*(a-s)&&(e-o)*(r-s)>=(n-o)*(t-s)&&(n-o)*(a-s)>=(i-o)*(r-s)}function Ba(e,t,n,r,i,a,o,s){return(e!==o||t!==s)&&za(e,t,n,r,i,a,o,s)}function Va(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!qa(e,t)&&(Ja(e,t)&&Ja(t,e)&&Ya(e,t)&&(Ha(e.prev,e,t.prev)||Ha(e,t.prev,t))||Ua(e,t)&&Ha(e.prev,e,e.next)>0&&Ha(t.prev,t,t.next)>0)}function Ha(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function Ua(e,t){return e.x===t.x&&e.y===t.y}function Wa(e,t,n,r){let i=Ka(Ha(e,t,n)),a=Ka(Ha(e,t,r)),o=Ka(Ha(n,r,e)),s=Ka(Ha(n,r,t));return!!(i!==a&&o!==s||i===0&&Ga(e,n,t)||a===0&&Ga(e,r,t)||o===0&&Ga(n,e,r)||s===0&&Ga(n,t,r))}function Ga(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function Ka(e){return e>0?1:e<0?-1:0}function qa(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Wa(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function Ja(e,t){return Ha(e.prev,e,e.next)<0?Ha(e,t,e.next)>=0&&Ha(e,e.prev,t)>=0:Ha(e,t,e.prev)<0||Ha(e,e.next,t)<0}function Ya(e,t){let n=e,r=!1,i=(e.x+t.x)/2,a=(e.y+t.y)/2;do n.y>a!=n.next.y>a&&n.next.y!==n.y&&i<(n.next.x-n.x)*(a-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Xa(e,t){let n=$a(e.i,e.x,e.y),r=$a(t.i,t.x,t.y),i=e.next,a=t.prev;return e.next=t,t.prev=e,n.next=i,i.prev=n,r.next=n,n.prev=r,a.next=r,r.prev=a,r}function Za(e,t,n,r){let i=$a(e,t,n);return r?(i.next=r.next,i.prev=r,r.next.prev=i,r.next=i):(i.prev=i,i.next=i),i}function Qa(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function $a(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function eo(e,t,n,r){let i=0;for(let a=t,o=n-r;a<n;a+=r)i+=(e[o]-e[a])*(e[a+1]+e[o+1]),o=a;return i}var to=class{static triangulate(e,t,n=2){return Sa(e,t,n)}},no=class e{static area(e){let t=e.length,n=0;for(let r=t-1,i=0;i<t;r=i++)n+=e[r].x*e[i].y-e[i].x*e[r].y;return n*.5}static isClockWise(t){return e.area(t)<0}static triangulateShape(e,t){let n=[],r=[],i=[];ro(e),io(n,e);let a=e.length;t.forEach(ro);for(let e=0;e<t.length;e++)r.push(a),a+=t[e].length,io(n,t[e]);let o=to.triangulate(n,r);for(let e=0;e<o.length;e+=3)i.push(o.slice(e,e+3));return i}};function ro(e){let t=e.length;t>2&&e[t-1].equals(e[0])&&e.pop()}function io(e,t){for(let n=0;n<t.length;n++)e.push(t[n].x),e.push(t[n].y)}var ao=class e extends si{constructor(e=new xa([new X(.5,.5),new X(-.5,.5),new X(-.5,-.5),new X(.5,-.5)]),t={}){super(),this.type=`ExtrudeGeometry`,this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];let n=this,r=[],i=[];for(let t=0,n=e.length;t<n;t++){let n=e[t];a(n)}this.setAttribute(`position`,new Yr(r,3)),this.setAttribute(`uv`,new Yr(i,2)),this.computeVertexNormals();function a(e){let a=[],o=t.curveSegments===void 0?12:t.curveSegments,s=t.steps===void 0?1:t.steps,c=t.depth===void 0?1:t.depth,l=t.bevelEnabled===void 0||t.bevelEnabled,u=t.bevelThickness===void 0?.2:t.bevelThickness,d=t.bevelSize===void 0?u-.1:t.bevelSize,f=t.bevelOffset===void 0?0:t.bevelOffset,p=t.bevelSegments===void 0?3:t.bevelSegments,m=t.extrudePath,h=t.UVGenerator===void 0?oo:t.UVGenerator,g,_=!1,v,y,b,x;if(m){g=m.getSpacedPoints(s),_=!0,l=!1;let e=m.isCatmullRomCurve3?m.closed:!1;v=m.computeFrenetFrames(s,e),y=new Z,b=new Z,x=new Z}l||(p=0,u=0,d=0,f=0);let S=e.extractPoints(o),C=S.shape,w=S.holes;if(!no.isClockWise(C)){C=C.reverse();for(let e=0,t=w.length;e<t;e++){let t=w[e];no.isClockWise(t)&&(w[e]=t.reverse())}}function T(e){let t=e[0];for(let n=1;n<=e.length;n++){let r=n%e.length,i=e[r],a=i.x-t.x,o=i.y-t.y,s=a*a+o*o,c=Math.max(Math.abs(i.x),Math.abs(i.y),Math.abs(t.x),Math.abs(t.y));s<=10000000000000001e-36*c*c?(e.splice(r,1),n--):t=i}}T(C),w.forEach(T);let E=w.length,D=C;for(let e=0;e<E;e++){let t=w[e];C=C.concat(t)}function O(e,t,n){return t||Dt(`ExtrudeGeometry: vec does not exist`),e.clone().addScaledVector(t,n)}let k=C.length;function A(e,t,n){let r,i,a,o=e.x-t.x,s=e.y-t.y,c=n.x-e.x,l=n.y-e.y,u=o*o+s*s,d=o*l-s*c;if(Math.abs(d)>2**-52){let d=Math.sqrt(u),f=Math.sqrt(c*c+l*l),p=t.x-s/d,m=t.y+o/d,h=n.x-l/f,g=n.y+c/f,_=((h-p)*l-(g-m)*c)/(o*l-s*c);r=p+o*_-e.x,i=m+s*_-e.y;let v=r*r+i*i;if(v<=2)return new X(r,i);a=Math.sqrt(v/2)}else{let e=!1;o>2**-52?c>2**-52&&(e=!0):o<-(2**-52)?c<-(2**-52)&&(e=!0):Math.sign(s)===Math.sign(l)&&(e=!0),e?(r=-s,i=o,a=Math.sqrt(u)):(r=o,i=s,a=Math.sqrt(u/2))}return new X(r/a,i/a)}let j=[];for(let e=0,t=D.length,n=t-1,r=e+1;e<t;e++,n++,r++)n===t&&(n=0),r===t&&(r=0),j[e]=A(D[e],D[n],D[r]);let M=[],N,P=j.concat();for(let e=0,t=E;e<t;e++){let t=w[e];N=[];for(let e=0,n=t.length,r=n-1,i=e+1;e<n;e++,r++,i++)r===n&&(r=0),i===n&&(i=0),N[e]=A(t[e],t[r],t[i]);M.push(N),P=P.concat(N)}let F;if(p===0)F=no.triangulateShape(D,w);else{let e=[],t=[];for(let n=0;n<p;n++){let r=n/p,i=u*Math.cos(r*Math.PI/2),a=d*Math.sin(r*Math.PI/2)+f;for(let t=0,n=D.length;t<n;t++){let n=O(D[t],j[t],a);z(n.x,n.y,-i),r===0&&e.push(n)}for(let e=0,n=E;e<n;e++){let n=w[e];N=M[e];let o=[];for(let e=0,t=n.length;e<t;e++){let t=O(n[e],N[e],a);z(t.x,t.y,-i),r===0&&o.push(t)}r===0&&t.push(o)}}F=no.triangulateShape(e,t)}let I=F.length,ee=d+f;for(let e=0;e<k;e++){let t=l?O(C[e],P[e],ee):C[e];_?(b.copy(v.normals[0]).multiplyScalar(t.x),y.copy(v.binormals[0]).multiplyScalar(t.y),x.copy(g[0]).add(b).add(y),z(x.x,x.y,x.z)):z(t.x,t.y,0)}for(let e=1;e<=s;e++)for(let t=0;t<k;t++){let n=l?O(C[t],P[t],ee):C[t];_?(b.copy(v.normals[e]).multiplyScalar(n.x),y.copy(v.binormals[e]).multiplyScalar(n.y),x.copy(g[e]).add(b).add(y),z(x.x,x.y,x.z)):z(n.x,n.y,c/s*e)}for(let e=p-1;e>=0;e--){let t=e/p,n=u*Math.cos(t*Math.PI/2),r=d*Math.sin(t*Math.PI/2)+f;for(let e=0,t=D.length;e<t;e++){let t=O(D[e],j[e],r);z(t.x,t.y,c+n)}for(let e=0,t=w.length;e<t;e++){let t=w[e];N=M[e];for(let e=0,i=t.length;e<i;e++){let i=O(t[e],N[e],r);_?z(i.x,i.y+g[s-1].y,g[s-1].x+n):z(i.x,i.y,c+n)}}}te(),L();function te(){let e=r.length/3;if(l){let e=0,t=k*e;for(let e=0;e<I;e++){let n=F[e];B(n[2]+t,n[1]+t,n[0]+t)}e=s+p*2,t=k*e;for(let e=0;e<I;e++){let n=F[e];B(n[0]+t,n[1]+t,n[2]+t)}}else{for(let e=0;e<I;e++){let t=F[e];B(t[2],t[1],t[0])}for(let e=0;e<I;e++){let t=F[e];B(t[0]+k*s,t[1]+k*s,t[2]+k*s)}}n.addGroup(e,r.length/3-e,0)}function L(){let e=r.length/3,t=0;R(D,t),t+=D.length;for(let e=0,n=w.length;e<n;e++){let n=w[e];R(n,t),t+=n.length}n.addGroup(e,r.length/3-e,1)}function R(e,t){let n=e.length;for(;--n>=0;){let r=n,i=n-1;i<0&&(i=e.length-1);for(let e=0,n=s+p*2;e<n;e++){let n=k*e,a=k*(e+1);ne(t+r+n,t+i+n,t+i+a,t+r+a)}}}function z(e,t,n){a.push(e),a.push(t),a.push(n)}function B(e,t,i){V(e),V(t),V(i);let a=r.length/3,o=h.generateTopUV(n,r,a-3,a-2,a-1);H(o[0]),H(o[1]),H(o[2])}function ne(e,t,i,a){V(e),V(t),V(a),V(t),V(i),V(a);let o=r.length/3,s=h.generateSideWallUV(n,r,o-6,o-3,o-2,o-1);H(s[0]),H(s[1]),H(s[3]),H(s[1]),H(s[2]),H(s[3])}function V(e){r.push(a[e*3+0]),r.push(a[e*3+1]),r.push(a[e*3+2])}function H(e){i.push(e.x),i.push(e.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return so(t,n,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new va[i.type]().fromJSON(i)),new e(r,t.options)}},oo={generateTopUV:function(e,t,n,r,i){let a=t[n*3],o=t[n*3+1],s=t[r*3],c=t[r*3+1],l=t[i*3],u=t[i*3+1];return[new X(a,o),new X(s,c),new X(l,u)]},generateSideWallUV:function(e,t,n,r,i,a){let o=t[n*3],s=t[n*3+1],c=t[n*3+2],l=t[r*3],u=t[r*3+1],d=t[r*3+2],f=t[i*3],p=t[i*3+1],m=t[i*3+2],h=t[a*3],g=t[a*3+1],_=t[a*3+2];return Math.abs(s-u)<Math.abs(o-l)?[new X(o,1-c),new X(l,1-d),new X(f,1-m),new X(h,1-_)]:[new X(s,1-c),new X(u,1-d),new X(p,1-m),new X(g,1-_)]}};function so(e,t,n){if(n.shapes=[],Array.isArray(e))for(let t=0,r=e.length;t<r;t++){let r=e[t];n.shapes.push(r.uuid)}else n.shapes.push(e.uuid);return n.options=Object.assign({},t),t.extrudePath!==void 0&&(n.options.extrudePath=t.extrudePath.toJSON()),n}var co=class e extends si{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new Yr(p,3)),this.setAttribute(`normal`,new Yr(m,3)),this.setAttribute(`uv`,new Yr(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},lo=class e extends si{constructor(e=new xa([new X(0,.5),new X(-.5,-.5),new X(.5,-.5)]),t=12){super(),this.type=`ShapeGeometry`,this.parameters={shapes:e,curveSegments:t};let n=[],r=[],i=[],a=[],o=0,s=0;if(Array.isArray(e)===!1)c(e);else for(let t=0;t<e.length;t++)c(e[t]),this.addGroup(o,s,t),o+=s,s=0;this.setIndex(n),this.setAttribute(`position`,new Yr(r,3)),this.setAttribute(`normal`,new Yr(i,3)),this.setAttribute(`uv`,new Yr(a,2));function c(e){let o=r.length/3,c=e.extractPoints(t),l=c.shape,u=c.holes;no.isClockWise(l)===!1&&(l=l.reverse());for(let e=0,t=u.length;e<t;e++){let t=u[e];no.isClockWise(t)===!0&&(u[e]=t.reverse())}let d=no.triangulateShape(l,u);for(let e=0,t=u.length;e<t;e++){let t=u[e];l=l.concat(t)}for(let e=0,t=l.length;e<t;e++){let t=l[e];r.push(t.x,t.y,0),i.push(0,0,1),a.push(t.x,t.y)}for(let e=0,t=d.length;e<t;e++){let t=d[e],r=t[0]+o,i=t[1]+o,a=t[2]+o;n.push(r,i,a),s+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){let e=super.toJSON(),t=this.parameters.shapes;return uo(t,e)}static fromJSON(t,n){let r=[];for(let e=0,i=t.shapes.length;e<i;e++){let i=n[t.shapes[e]];r.push(i)}return new e(r,t.curveSegments)}};function uo(e,t){if(t.shapes=[],Array.isArray(e))for(let n=0,r=e.length;n<r;n++){let r=e[n];t.shapes.push(r.uuid)}else t.shapes.push(e.uuid);return t}var fo=class extends pi{constructor(e){super(),this.isShadowMaterial=!0,this.type=`ShadowMaterial`,this.color=new dr(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};function po(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(ho(i))i.isRenderTargetTexture?(Y(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(ho(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function mo(e){let t={};for(let n=0;n<e.length;n++){let r=po(e[n]);for(let e in r)t[e]=r[e]}return t}function ho(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function go(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function _o(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:mn.workingColorSpace}var vo={clone:po,merge:mo},yo=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bo=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,xo=class extends pi{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=yo,this.fragmentShader=bo,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=po(e.uniforms),this.uniformsGroups=go(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new dr().setHex(r.value);break;case`v2`:this.uniforms[n].value=new X().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new Z().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new Tn().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new ln().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new An().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},So=class extends xo{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Co=class extends pi{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type=`MeshNormalMaterial`,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}},wo=class extends pi{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new dr(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new dr(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Bn,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},To=class extends pi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=dt,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Eo=class extends pi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Do(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Oo(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var ko=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Ao=class extends ko{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ct,endingEnd:ct}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case lt:i=e,o=2*t-n;break;case ut:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case lt:a=e,s=2*n-t;break;case ut:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},jo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Mo=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},No=class extends ko{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Io(n,t,g,y,r);i[p]=Po(x,o,_,b,m)}return i}};function Po(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Fo(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Io(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Po(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Fo(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Lo=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Do(t,this.TimeBufferType),this.values=Do(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Do(e.times,Array),values:Do(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Oo(e.settings)&&(n.settings={inTangents:Do(e.settings.inTangents,Array),outTangents:Do(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Mo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new jo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ao(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new No(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case it:t=this.InterpolantFactoryMethodDiscrete;break;case at:t=this.InterpolantFactoryMethodLinear;break;case ot:t=this.InterpolantFactoryMethodSmooth;break;case st:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return Y(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return it;case this.InterpolantFactoryMethodLinear:return at;case this.InterpolantFactoryMethodSmooth:return ot;case this.InterpolantFactoryMethodBezier:return st}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Oo(this.settings)&&(Ro(this.settings.inTangents,e),Ro(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(Dt(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(Dt(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){Dt(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){Dt(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&xt(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){Dt(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===ot,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Oo(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Ro(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Lo.prototype.ValueTypeName=``,Lo.prototype.TimeBufferType=Float32Array,Lo.prototype.ValueBufferType=Float32Array,Lo.prototype.DefaultInterpolation=at;var zo=class extends Lo{constructor(e,t,n){super(e,t,n)}};zo.prototype.ValueTypeName=`bool`,zo.prototype.ValueBufferType=Array,zo.prototype.DefaultInterpolation=it,zo.prototype.InterpolantFactoryMethodLinear=void 0,zo.prototype.InterpolantFactoryMethodSmooth=void 0;var Bo=class extends Lo{constructor(e,t,n,r){super(e,t,n,r)}};Bo.prototype.ValueTypeName=`color`;var Vo=class extends Lo{constructor(e,t,n,r){super(e,t,n,r)}};Vo.prototype.ValueTypeName=`number`;var Ho=class extends ko{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)on.slerpFlat(i,0,a,c-o,a,c,s);return i}},Uo=class extends Lo{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new Ho(this.times,this.values,this.getValueSize(),e)}};Uo.prototype.ValueTypeName=`quaternion`,Uo.prototype.InterpolantFactoryMethodSmooth=void 0;var Wo=class extends Lo{constructor(e,t,n){super(e,t,n)}};Wo.prototype.ValueTypeName=`string`,Wo.prototype.ValueBufferType=Array,Wo.prototype.DefaultInterpolation=it,Wo.prototype.InterpolantFactoryMethodLinear=void 0,Wo.prototype.InterpolantFactoryMethodSmooth=void 0;var Go=class extends Lo{constructor(e,t,n,r){super(e,t,n,r)}};Go.prototype.ValueTypeName=`vector`;var Ko=class extends rr{constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new dr(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},qo=class extends Ko{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type=`HemisphereLight`,this.position.copy(rr.DEFAULT_UP),this.updateMatrix(),this.groundColor=new dr(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},Jo=new An,Yo=new Z,Xo=new Z,Zo=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new X(512,512),this.mapType=ae,this.map=null,this.mapPass=null,this.matrix=new An,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ri,this._frameExtents=new X(1,1),this._viewportCount=1,this._viewports=[new Tn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Yo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Yo),Xo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Xo),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){Jo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Jo,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Jo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},Qo=new Z,$o=new on,es=new Z,ts=class extends rr{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new An,this.projectionMatrix=new An,this.projectionMatrixInverse=new An,this.coordinateSystem=yt,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Qo,$o,es),es.x===1&&es.y===1&&es.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qo,$o,es.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Qo,$o,es),es.x===1&&es.y===1&&es.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Qo,$o,es.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ns=new Z,rs=new X,is=new X,as=class extends ts{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Ft*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Pt*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ft*2*Math.atan(Math.tan(Pt*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){ns.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(ns.x,ns.y).multiplyScalar(-e/ns.z),ns.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ns.x,ns.y).multiplyScalar(-e/ns.z)}getViewSize(e,t){return this.getViewBounds(e,rs,is),t.subVectors(is,rs)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Pt*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},os=class extends ts{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},ss=class extends Zo{constructor(){super(new os(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},cs=class extends Ko{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(rr.DEFAULT_UP),this.updateMatrix(),this.target=new rr,this.shadow=new ss}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},ls=-90,us=1,ds=class extends rr{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new as(ls,us,e,t);r.layers=this.layers,this.add(r);let i=new as(ls,us,e,t);i.layers=this.layers,this.add(i);let a=new as(ls,us,e,t);a.layers=this.layers,this.add(a);let o=new as(ls,us,e,t);o.layers=this.layers,this.add(o);let s=new as(ls,us,e,t);s.layers=this.layers,this.add(s);let c=new as(ls,us,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},fs=class extends as{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},ps=`\\[\\]\\.:\\/`,ms=RegExp(`[\\[\\]\\.:\\/]`,`g`),hs=`[^\\[\\]\\.:\\/]`,gs=`[^`+ps.replace(`\\.`,``)+`]`,_s=`((?:WC+[\\/:])*)`.replace(`WC`,hs),vs=`(WCOD+)?`.replace(`WCOD`,gs),ys=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,hs),bs=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,hs),xs=RegExp(`^`+_s+vs+ys+bs+`$`),Ss=[`material`,`materials`,`bones`,`map`],Cs=class{constructor(e,t,n){let r=n||ws.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},ws=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(ms,``)}static parseTrackName(e){let t=xs.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Ss.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Y(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){Dt(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){Dt(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){Dt(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){Dt(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){Dt(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){Dt(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){Dt(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;Dt(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){Dt(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){Dt(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ws.Composite=Cs,ws.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},ws.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},ws.prototype.GetterByBindingType=[ws.prototype._getValue_direct,ws.prototype._getValue_array,ws.prototype._getValue_arrayElement,ws.prototype._getValue_toArray],ws.prototype.SetterByBindingTypeAndVersioning=[[ws.prototype._setValue_direct,ws.prototype._setValue_direct_setNeedsUpdate,ws.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ws.prototype._setValue_array,ws.prototype._setValue_array_setNeedsUpdate,ws.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ws.prototype._setValue_arrayElement,ws.prototype._setValue_arrayElement_setNeedsUpdate,ws.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ws.prototype._setValue_fromArray,ws.prototype._setValue_fromArray_setNeedsUpdate,ws.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ts=new An,Es=class{constructor(e,t,n=0,r=1/0){this.ray=new vi(e,t),this.near=n,this.far=r,this.camera=null,this.layers=new Vn,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Dt(`Raycaster: Unsupported camera type: `+t.type)}setFromXRController(e){return Ts.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ts),this}intersectObject(e,t=!0,n=[]){return Os(e,this,n,t),n.sort(Ds),n}intersectObjects(e,t=!0,n=[]){for(let r=0,i=e.length;r<i;r++)Os(e[r],this,n,t);return n.sort(Ds),n}};function Ds(e,t){return e.distance-t.distance}function Os(e,t,n,r){let i=!0;if(e.layers.test(t.layers)&&e.raycast(t,n)===!1&&(i=!1),i===!0&&r===!0){let r=e.children;for(let e=0,i=r.length;e<i;e++)Os(r[e],t,n,!0)}}(class e{static{e.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}});var ks=new Z,As=new Z,js=new Z,Ms=new Z,Ns=new Z,Ps=new Z,Fs=new Z,Is=class{constructor(e=new Z,t=new Z){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){ks.subVectors(e,this.start),As.subVectors(this.end,this.start);let n=As.dot(As);if(n===0)return 0;let r=As.dot(ks)/n;return t&&(r=Lt(r,0,1)),r}closestPointToPoint(e,t,n){let r=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,t=Ps,n=Fs){let r=1e-8*1e-8,i,a,o=this.start,s=e.start,c=this.end,l=e.end;js.subVectors(c,o),Ms.subVectors(l,s),Ns.subVectors(o,s);let u=js.dot(js),d=Ms.dot(Ms),f=Ms.dot(Ns);if(u<=r&&d<=r)return t.copy(o),n.copy(s),t.sub(n),t.dot(t);if(u<=r)i=0,a=f/d,a=Lt(a,0,1);else{let e=js.dot(Ns);if(d<=r)a=0,i=Lt(-e/u,0,1);else{let t=js.dot(Ms),n=u*d-t*t;i=n===0?0:Lt((t*f-e*d)/n,0,1),a=(t*i+f)/d,a<0?(a=0,i=Lt(-e/u,0,1)):a>1&&(a=1,i=Lt((t-e)/u,0,1))}}return t.copy(o).addScaledVector(js,i),n.copy(s).addScaledVector(Ms,a),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};function Ls(e,t,n,r){let i=Rs(r);switch(n){case ge:return e*t;case G:return e*t/i.components*i.byteLength;case xe:return e*t/i.components*i.byteLength;case Se:return e*t*2/i.components*i.byteLength;case Ce:return e*t*2/i.components*i.byteLength;case _e:return e*t*3/i.components*i.byteLength;case ve:return e*t*4/i.components*i.byteLength;case we:return e*t*4/i.components*i.byteLength;case Te:case Ee:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case K:case De:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Oe:case Ae:return Math.max(e,16)*Math.max(t,8)/4;case q:case ke:return Math.max(e,8)*Math.max(t,8)/2;case je:case Me:case Pe:case Fe:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case Ne:case Ie:case Le:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case Re:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case ze:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Be:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Ve:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case He:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case Ue:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case We:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case Ge:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Ke:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case J:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case qe:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Je:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Ye:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Xe:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ze:case Qe:case $e:return Math.ceil(e/4)*Math.ceil(t/4)*16;case et:case tt:return Math.ceil(e/4)*Math.ceil(t/4)*8;case nt:case rt:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Rs(e){switch(e){case ae:case oe:return{byteLength:1,components:1};case ce:case se:case de:return{byteLength:2,components:1};case fe:case W:return{byteLength:2,components:4};case U:case le:case ue:return{byteLength:4,components:1};case me:case he:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`186`}})),typeof window<`u`&&(window.__THREE__?Y(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`186`);function zs(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Bs(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Vs={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cube_uv_reflection_fragment:`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Q={common:{diffuse:{value:new dr(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ln},alphaMap:{value:null},alphaMapTransform:{value:new ln},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ln}},envmap:{envMap:{value:null},envMapRotation:{value:new ln},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ln}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ln}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ln},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ln},normalScale:{value:new X(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ln},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ln}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ln}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ln}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new dr(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new Z},probesMax:{value:new Z},probesResolution:{value:new Z}},points:{diffuse:{value:new dr(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ln},alphaTest:{value:0},uvTransform:{value:new ln}},sprite:{diffuse:{value:new dr(16777215)},opacity:{value:1},center:{value:new X(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ln},alphaMap:{value:null},alphaMapTransform:{value:new ln},alphaTest:{value:0}}},Hs={basic:{uniforms:mo([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Vs.meshbasic_vert,fragmentShader:Vs.meshbasic_frag},lambert:{uniforms:mo([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new dr(0)},envMapIntensity:{value:1}}]),vertexShader:Vs.meshlambert_vert,fragmentShader:Vs.meshlambert_frag},phong:{uniforms:mo([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new dr(0)},specular:{value:new dr(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Vs.meshphong_vert,fragmentShader:Vs.meshphong_frag},standard:{uniforms:mo([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new dr(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Vs.meshphysical_vert,fragmentShader:Vs.meshphysical_frag},toon:{uniforms:mo([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new dr(0)}}]),vertexShader:Vs.meshtoon_vert,fragmentShader:Vs.meshtoon_frag},matcap:{uniforms:mo([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Vs.meshmatcap_vert,fragmentShader:Vs.meshmatcap_frag},points:{uniforms:mo([Q.points,Q.fog]),vertexShader:Vs.points_vert,fragmentShader:Vs.points_frag},dashed:{uniforms:mo([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Vs.linedashed_vert,fragmentShader:Vs.linedashed_frag},depth:{uniforms:mo([Q.common,Q.displacementmap]),vertexShader:Vs.depth_vert,fragmentShader:Vs.depth_frag},normal:{uniforms:mo([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Vs.meshnormal_vert,fragmentShader:Vs.meshnormal_frag},sprite:{uniforms:mo([Q.sprite,Q.fog]),vertexShader:Vs.sprite_vert,fragmentShader:Vs.sprite_frag},background:{uniforms:{uvTransform:{value:new ln},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Vs.background_vert,fragmentShader:Vs.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ln}},vertexShader:Vs.backgroundCube_vert,fragmentShader:Vs.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Vs.cube_vert,fragmentShader:Vs.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Vs.equirect_vert,fragmentShader:Vs.equirect_frag},distance:{uniforms:mo([Q.common,Q.displacementmap,{referencePosition:{value:new Z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Vs.distance_vert,fragmentShader:Vs.distance_frag},shadow:{uniforms:mo([Q.lights,Q.fog,{color:{value:new dr(0)},opacity:{value:1}}]),vertexShader:Vs.shadow_vert,fragmentShader:Vs.shadow_frag}};Hs.physical={uniforms:mo([Hs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ln},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ln},clearcoatNormalScale:{value:new X(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ln},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ln},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ln},sheen:{value:0},sheenColor:{value:new dr(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ln},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ln},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ln},transmissionSamplerSize:{value:new X},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ln},attenuationDistance:{value:0},attenuationColor:{value:new dr(0)},specularColor:{value:new dr(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ln},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ln},anisotropyVector:{value:new X},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ln}}]),vertexShader:Vs.meshphysical_vert,fragmentShader:Vs.meshphysical_frag};var Us={r:0,b:0,g:0},Ws=new An,Gs=new ln;Gs.set(-1,0,0,0,1,0,0,0,1);function Ks(e,t,n,r,i,a){let o=new dr(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&(i.isCubeTexture||i.mapping===306)?(l===void 0&&(l=new ji(new Wi(1,1,1),new xo({name:`BackgroundCubeMaterial`,uniforms:po(Hs.backgroundCube.uniforms),vertexShader:Hs.backgroundCube.vertexShader,fragmentShader:Hs.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Ws.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isCubeTexture&&i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Gs),l.material.toneMapped=mn.getTransfer(i.colorSpace)!==gt,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new ji(new co(2,2),new xo({name:`BackgroundMaterial`,uniforms:po(Hs.background.uniforms),vertexShader:Hs.background.vertexShader,fragmentShader:Hs.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=mn.getTransfer(i.colorSpace)!==gt,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Us,_o(e)),n.buffers.color.setClear(Us.r,Us.g,Us.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function qs(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.stride,p=s.offset;if(t.isInstancedInterleavedBuffer){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function Js(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function Ys(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(Y(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.logarithmicDepthBuffer===!0,f=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`);n.reversedDepthBuffer===!0&&f===!1&&Y(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function Xs(e){let t=this,n=null,r=0,i=!1,a=!1,o=new di,s=new ln,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var Zs=4,Qs=6,$s=20,ec=256,tc=new os,nc=new dr,rc=null,ic=0,ac=0,oc=!1,sc=new Z,cc=new Z,lc=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=sc}=i;rc=this._renderer.getRenderTarget(),ic=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),oc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,n,r,s,o),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=gc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=2**this._lodMax}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(rc,ic,ac),this._renderer.xr.enabled=oc,e.scissorTest=!1,fc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),rc=this._renderer.getRenderTarget(),ic=this._renderer.getActiveCubeFace(),ac=this._renderer.getActiveMipmapLevel(),oc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:H,minFilter:H,generateMipmaps:!1,type:de,format:ve,colorSpace:mt,depthBuffer:!1},r=dc(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=dc(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=uc(r)),this._blurMaterial=mc(r,e,t),this._ggxMaterial=pc(r,e,t)}return r}_compileMaterial(e){let t=new ji(new si,e);this._renderer.compile(t,tc)}_sceneToCubeUV(e,t,n,r,i){let a=new as(90,1,t,n),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],c=this._renderer,l=c.autoClear,u=c.toneMapping;c.getClearColor(nc),c.toneMapping=0,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(r),c.clearDepth(),c.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ji(new Wi,new yi({name:`PMREM.Background`,side:1,depthWrite:!1,depthTest:!1})));let d=this._backgroundBox,f=d.material,p=!1,m=e.background;m?m.isColor&&(f.color.copy(m),e.background=null,p=!0):(f.color.copy(nc),p=!0);for(let t=0;t<6;t++){let n=t%3;n===0?(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x+s[t],i.y,i.z)):n===1?(a.up.set(0,0,o[t]),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y+s[t],i.z)):(a.up.set(0,o[t],0),a.position.set(i.x,i.y,i.z),a.lookAt(i.x,i.y,i.z+s[t]));let l=this._cubeSize;fc(r,n*l,t>2?l:0,l,l),c.setRenderTarget(r),p&&c.render(d,a),c.render(e,a)}c.toneMapping=u,c.autoClear=l,e.background=m}_textureToCubeUV(e,t){let n=this._renderer,r=e.mapping===301||e.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=gc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hc());let i=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=i;let o=i.uniforms;o.envMap.value=e;let s=this._cubeSize;fc(t,0,0,3*s,2*s),n.setRenderTarget(t),n.render(a,tc)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let t=1;t<r;t++)this._applyGGXFilter(e,t-1,t);t.autoClear=n}_applyGGXFilter(e,t,n){let r=this._renderer,i=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let s=a.uniforms,c=n/(this._lodMeshes.length-1),l=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-l*l)*(c*1.25),{_lodMax:d}=this,f=this._sizeLods[n],p=3*f*(n>d-Zs?n-d+Zs:0),m=4*(this._cubeSize-f);s.envMap.value=e.texture,s.roughness.value=u,s.mipInt.value=d-t,fc(i,p,m,3*f,2*f),r.setRenderTarget(i),r.render(o,tc),s.envMap.value=i.texture,s.roughness.value=0,s.mipInt.value=d-n,fc(e,p,m,3*f,2*f),r.setRenderTarget(e),r.render(o,tc)}_blur(e,t,n,r){let i=this._pingPongRenderTarget,a=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,i,t,n,a),this._blurPass(i,e,n,n,a)}_blurPass(e,t,n,r,i){let a=this._renderer,o=this._blurMaterial,s=this._lodMeshes[r];s.material=o;let c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=i,c.mipInt.value=this._lodMax-n;let l=this._sizeLods[r];fc(t,3*l*(r>this._lodMax-Zs?r-this._lodMax+Zs:0),4*(this._cubeSize-l),3*l,2*l),a.setRenderTarget(t),a.render(s,tc)}};function uc(e){let t=[],n=[],r=e,i=e-Zs+1+Qs;for(let e=0;e<i;e++){let e=2**r;t.push(e);let i=1/(e-2),a=-i,o=1+i,s=[a,a,o,a,o,o,a,a,o,o,a,o],c=new Float32Array(108),l=new Float32Array(108);for(let e=0;e<6;e++){let t=e%3*2/3-1,n=e>2?0:-1,r=[t,n,0,t+2/3,n,0,t+2/3,n+1,0,t,n,0,t+2/3,n+1,0,t,n+1,0];c.set(r,18*e);for(let t=0;t<6;t++){let n=s[t*2]*2-1,r=s[t*2+1]*2-1;e===0?cc.set(1,r,n):e===1?cc.set(-n,1,-r):e===2?cc.set(-n,r,1):e===3?cc.set(-1,r,-n):e===4?cc.set(-n,-1,r):cc.set(n,r,-1),cc.toArray(l,(e*6+t)*3)}}let u=new si;u.setAttribute(`position`,new Kr(c,3)),u.setAttribute(`outputDirection`,new Kr(l,3)),n.push(new ji(u,null)),r>Zs&&r--}return{lodMeshes:n,sizeLods:t}}function dc(e,t,n){let r=new Dn(e,t,n);return r.texture.mapping=306,r.texture.name=`PMREM.cubeUv`,r.scissorTest=!0,r}function fc(e,t,n,r,i){e.viewport.set(t,n,r,i),e.scissor.set(t,n,r,i)}function pc(e,t,n){return new xo({name:`PMREMGGXConvolution`,defines:{GGX_SAMPLES:ec,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:_c(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function mc(e,t,n){return new xo({name:`SphericalGaussianBlur`,defines:{SAMPLES:$s,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${e}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:_c(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function hc(){return new xo({name:`EquirectangularToCubeUV`,uniforms:{envMap:{value:null}},vertexShader:_c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function gc(){return new xo({name:`CubemapToCubeUV`,uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_c(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function _c(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var vc=class extends Dn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new zi(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Wi(5,5,5),i=new xo({name:`CubemapFromEquirect`,uniforms:po(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new ji(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=H),new ds(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}};function yc(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new vc(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new lc(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new lc(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function bc(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&Ot(`WebGLRenderer: `+e+` extension not supported.`),t}}}function xc(e,t,n,r){let i={},a=new WeakMap;function o(e){let s=e.target;s.index!==null&&t.remove(s.index);for(let e in s.attributes)t.remove(s.attributes[e]);s.removeEventListener(`dispose`,o),delete i[s.id];let c=a.get(s);c&&(t.remove(c),a.delete(s)),r.releaseStatesOfGeometry(s),s.isInstancedBufferGeometry===!0&&delete s._maxInstanceCount,n.memory.geometries--}function s(e,t){return i[t.id]===!0||(t.addEventListener(`dispose`,o),i[t.id]=!0,n.memory.geometries++),t}function c(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function l(e){let n=[],r=e.index,i=e.attributes.position,o=0;if(i===void 0)return;if(r!==null){let e=r.array;o=r.version;for(let t=0,r=e.length;t<r;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];n.push(r,i,i,a,a,r)}}else{let e=i.array;o=i.version;for(let t=0,r=e.length/3-1;t<r;t+=3){let e=t+0,r=t+1,i=t+2;n.push(e,r,r,i,i,e)}}let s=new(i.count>=65535?Jr:qr)(n,1);s.version=o;let c=a.get(e);c&&t.remove(c),a.set(e,s)}function u(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&l(e)}else l(e);return a.get(e)}return{get:s,update:c,getWireframeAttribute:u}}function Sc(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Cc(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:Dt(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function wc(e,t,n){let r=new WeakMap,i=new Tn;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new On(h,p,m,u);g.type=ue,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new X(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Tc(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Ec={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function Dc(e,t,n,r,i,a){let o=new Dn(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=new si;l.setAttribute(`position`,new Yr([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute(`uv`,new Yr([0,2,0,0,2,0],2));let u=new So({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new ji(l,u),f=new os(-1,1,1,-1,0,1),p=null,m=null,h=!1,g,_=null,v=[],y=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<v.length;n++){let r=v[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){v=e,y=v.length>0&&v[0].isRenderPass===!0;let t=o.width,n=o.height;v.length>0&&s===null&&(s=new Dn(t,n,{type:de,depthBuffer:!1,stencilBuffer:!1}),c=new Dn(t,n,{type:de,depthBuffer:!1,stencilBuffer:!1}));for(let e=0;e<v.length;e++){let r=v[e];r.setSize&&r.setSize(t,n)}},this.begin=function(e,t){if(h||e.toneMapping===0&&v.length===0)return!1;if(_=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return y===!1&&e.setRenderTarget(o),g=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return y},this.end=function(e,t){e.toneMapping=g,h=!0;let n=o,r=s;for(let i=0;i<v.length;i++){let a=v[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(p!==e.outputColorSpace||m!==e.toneMapping){p=e.outputColorSpace,m=e.toneMapping,u.defines={},mn.getTransfer(p)===`srgb`&&(u.defines.SRGB_TRANSFER=``);let t=Ec[m];t&&(u.defines[t]=``),u.needsUpdate=!0}u.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(_),e.render(d,f),_=null,h=!1},this.isCompositing=function(){return h},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),l.dispose(),u.dispose()}}var Oc=new wn,kc=new Vi(1,1),Ac=new On,jc=new kn,Mc=new zi,Nc=[],Pc=[],Fc=new Float32Array(16),Ic=new Float32Array(9),Lc=new Float32Array(4);function Rc(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Nc[i];if(a===void 0&&(a=new Float32Array(i),Nc[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function zc(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Bc(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Vc(e,t){let n=Pc[t];n===void 0&&(n=new Int32Array(t),Pc[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Hc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Uc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(zc(n,t))return;e.uniform2fv(this.addr,t),Bc(n,t)}}function Wc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(zc(n,t))return;e.uniform3fv(this.addr,t),Bc(n,t)}}function Gc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(zc(n,t))return;e.uniform4fv(this.addr,t),Bc(n,t)}}function Kc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(zc(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Bc(n,t)}else{if(zc(n,r))return;Lc.set(r),e.uniformMatrix2fv(this.addr,!1,Lc),Bc(n,r)}}function qc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(zc(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Bc(n,t)}else{if(zc(n,r))return;Ic.set(r),e.uniformMatrix3fv(this.addr,!1,Ic),Bc(n,r)}}function Jc(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(zc(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Bc(n,t)}else{if(zc(n,r))return;Fc.set(r),e.uniformMatrix4fv(this.addr,!1,Fc),Bc(n,r)}}function Yc(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function Xc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(zc(n,t))return;e.uniform2iv(this.addr,t),Bc(n,t)}}function Zc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(zc(n,t))return;e.uniform3iv(this.addr,t),Bc(n,t)}}function Qc(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(zc(n,t))return;e.uniform4iv(this.addr,t),Bc(n,t)}}function $c(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function el(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(zc(n,t))return;e.uniform2uiv(this.addr,t),Bc(n,t)}}function tl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(zc(n,t))return;e.uniform3uiv(this.addr,t),Bc(n,t)}}function nl(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(zc(n,t))return;e.uniform4uiv(this.addr,t),Bc(n,t)}}function rl(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;this.type===e.SAMPLER_2D_SHADOW?(kc.compareFunction=n.isReversedDepthBuffer()?518:515,a=kc):a=Oc,n.setTexture2D(t||a,i)}function il(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||jc,i)}function al(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTextureCube(t||Mc,i)}function ol(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Ac,i)}function sl(e){switch(e){case 5126:return Hc;case 35664:return Uc;case 35665:return Wc;case 35666:return Gc;case 35674:return Kc;case 35675:return qc;case 35676:return Jc;case 5124:case 35670:return Yc;case 35667:case 35671:return Xc;case 35668:case 35672:return Zc;case 35669:case 35673:return Qc;case 5125:return $c;case 36294:return el;case 36295:return tl;case 36296:return nl;case 35678:case 36198:case 36298:case 36306:case 35682:return rl;case 35679:case 36299:case 36307:return il;case 35680:case 36300:case 36308:case 36293:return al;case 36289:case 36303:case 36311:case 36292:return ol}}function cl(e,t){e.uniform1fv(this.addr,t)}function ll(e,t){let n=Rc(t,this.size,2);e.uniform2fv(this.addr,n)}function ul(e,t){let n=Rc(t,this.size,3);e.uniform3fv(this.addr,n)}function dl(e,t){let n=Rc(t,this.size,4);e.uniform4fv(this.addr,n)}function fl(e,t){let n=Rc(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function pl(e,t){let n=Rc(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function ml(e,t){let n=Rc(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function hl(e,t){e.uniform1iv(this.addr,t)}function gl(e,t){e.uniform2iv(this.addr,t)}function _l(e,t){e.uniform3iv(this.addr,t)}function vl(e,t){e.uniform4iv(this.addr,t)}function yl(e,t){e.uniform1uiv(this.addr,t)}function bl(e,t){e.uniform2uiv(this.addr,t)}function xl(e,t){e.uniform3uiv(this.addr,t)}function Sl(e,t){e.uniform4uiv(this.addr,t)}function Cl(e,t,n){let r=this.cache,i=t.length,a=Vc(n,i);zc(r,a)||(e.uniform1iv(this.addr,a),Bc(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?kc:Oc;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function wl(e,t,n){let r=this.cache,i=t.length,a=Vc(n,i);zc(r,a)||(e.uniform1iv(this.addr,a),Bc(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||jc,a[e])}function Tl(e,t,n){let r=this.cache,i=t.length,a=Vc(n,i);zc(r,a)||(e.uniform1iv(this.addr,a),Bc(r,a));for(let e=0;e!==i;++e)n.setTextureCube(t[e]||Mc,a[e])}function El(e,t,n){let r=this.cache,i=t.length,a=Vc(n,i);zc(r,a)||(e.uniform1iv(this.addr,a),Bc(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Ac,a[e])}function Dl(e){switch(e){case 5126:return cl;case 35664:return ll;case 35665:return ul;case 35666:return dl;case 35674:return fl;case 35675:return pl;case 35676:return ml;case 5124:case 35670:return hl;case 35667:case 35671:return gl;case 35668:case 35672:return _l;case 35669:case 35673:return vl;case 5125:return yl;case 36294:return bl;case 36295:return xl;case 36296:return Sl;case 35678:case 36198:case 36298:case 36306:case 35682:return Cl;case 35679:case 36299:case 36307:return wl;case 35680:case 36300:case 36308:case 36293:return Tl;case 36289:case 36303:case 36311:case 36292:return El}}var Ol=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=sl(t.type)}},kl=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Dl(t.type)}},Al=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},jl=/(\w+)(\])?(\[|\.)?/g;function Ml(e,t){e.seq.push(t),e.map[t.id]=t}function Nl(e,t,n){let r=e.name,i=r.length;for(jl.lastIndex=0;;){let a=jl.exec(r),o=jl.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Ml(n,l===void 0?new Ol(s,e,t):new kl(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Al(s),Ml(n,e)),n=e}}}var Pl=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Nl(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function Fl(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Il=37297,Ll=0;function Rl(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var zl=new ln;function Bl(e){mn._getMatrix(zl,mn.workingColorSpace,e);let t=`mat3( ${zl.elements.map(e=>e.toFixed(4))} )`;switch(mn.getTransfer(e)){case ht:return[t,`LinearTransferOETF`];case gt:return[t,`sRGBTransferOETF`];default:return Y(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Vl(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Rl(e.getShaderSource(t),r)}return i}function Hl(e,t){let n=Bl(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,`}`].join(`
`)}var Ul={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Wl(e,t){let n=Ul[t];return n===void 0?(Y(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Gl=new Z;function Kl(){return mn.getLuminanceCoefficients(Gl),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Gl.x.toFixed(4)}, ${Gl.y.toFixed(4)}, ${Gl.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function ql(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(Xl).join(`
`)}function Jl(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function Yl(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function Xl(e){return e!==``}function Zl(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ql(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var $l=/^[ \t]*#include +<([\w\d./]+)>/gm;function eu(e){return e.replace($l,nu)}var tu=new Map;function nu(e,t){let n=Vs[t];if(n===void 0){let e=tu.get(t);if(e!==void 0)n=Vs[e],Y(`WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.`,t,e);else throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`)}return eu(n)}var ru=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function iu(e){return e.replace(ru,au)}function au(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function ou(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var su={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function cu(e){return su[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var lu={301:`ENVMAP_TYPE_CUBE`,302:`ENVMAP_TYPE_CUBE`,306:`ENVMAP_TYPE_CUBE_UV`};function uu(e){return e.envMap===!1?`ENVMAP_TYPE_CUBE`:lu[e.envMapMode]||`ENVMAP_TYPE_CUBE`}var du={302:`ENVMAP_MODE_REFRACTION`};function fu(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:du[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var pu={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function mu(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:pu[e.combine]||`ENVMAP_BLENDING_NONE`}function hu(e){let t=e.envMapCubeUVHeight;if(t===null)return null;let n=Math.log2(t)-2,r=1/t;return{texelWidth:1/(3*Math.max(2**n,112)),texelHeight:r,maxMip:n}}function gu(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=cu(n),l=uu(n),u=fu(n),d=mu(n),f=hu(n),p=ql(n),m=Jl(a),h=i.createProgram(),g,_,v=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Xl).join(`
`),g.length>0&&(g+=`
`),_=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m].filter(Xl).join(`
`),_.length>0&&(_+=`
`)):(g=[ou(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(Xl).join(`
`),_=[ou(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,m,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,f?`#define CUBEUV_TEXEL_WIDTH `+f.texelWidth:``,f?`#define CUBEUV_TEXEL_HEIGHT `+f.texelHeight:``,f?`#define CUBEUV_MAX_MIP `+f.maxMip+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.numLightProbeGrids>0?`#define USE_LIGHT_PROBES_GRID`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Vs.tonemapping_pars_fragment,n.toneMapping===0?``:Wl(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Vs.colorspace_pars_fragment,Hl(`linearToOutputTexel`,n.outputColorSpace),Kl(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(Xl).join(`
`)),o=eu(o),o=Zl(o,n),o=Ql(o,n),s=eu(s),s=Zl(s,n),s=Ql(s,n),o=iu(o),s=iu(s),n.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,g=[p,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+g,_=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+_);let y=v+g+o,b=v+_+s,x=Fl(i,i.VERTEX_SHADER,y),S=Fl(i,i.FRAGMENT_SHADER,b);i.attachShader(h,x),i.attachShader(h,S),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(h,0,`position`):i.bindAttribLocation(h,0,n.index0AttributeName),i.linkProgram(h);function C(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(h)||``,r=i.getShaderInfoLog(x)||``,a=i.getShaderInfoLog(S)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(h,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,h,x,S);else{let e=Vl(i,x,`vertex`),n=Vl(i,S,`fragment`);Dt(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(h,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):Y(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:g},fragmentShader:{log:c,prefix:_}})}i.deleteShader(x),i.deleteShader(S),w=new Pl(i,h),T=Yl(i,h)}let w;this.getUniforms=function(){return w===void 0&&C(this),w};let T;this.getAttributes=function(){return T===void 0&&C(this),T};let E=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(h,Il)),E},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(h),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Ll++,this.cacheKey=t,this.usedTimes=1,this.program=h,this.vertexShader=x,this.fragmentShader=S,this}var _u=0,vu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new yu(e),t.set(e,n)),n}},yu=class{constructor(e){this.id=_u++,this.code=e,this.usedTimes=0}};function bu(e){return e===1030||e===37490||e===36285}function xu(e,t,n,r,i,a){let o=new Vn,s=new vu,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f=r.precision,p={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function m(e){return c.add(e),e===0?`uv`:`uv${e}`}function h(i,o,l,u,h,g){let _=u.fog,v=h.geometry,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,b=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,x=t.get(i.envMap||y,b),S=x&&x.mapping===306?x.image.height:null,C=p[i.type];i.precision!==null&&(f=r.getMaxPrecision(i.precision),f!==i.precision&&Y(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,f,`instead.`));let w=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,T=w===void 0?0:w.length,E=0;v.morphAttributes.position!==void 0&&(E=1),v.morphAttributes.normal!==void 0&&(E=2),v.morphAttributes.color!==void 0&&(E=3);let D,O,k,A;if(C){let e=Hs[C];D=e.vertexShader,O=e.fragmentShader}else{D=i.vertexShader,O=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),k=e.id,A=t.id}let j=e.getRenderTarget(),M=e.state.buffers.depth.getReversed(),N=h.isInstancedMesh===!0,P=h.isBatchedMesh===!0,F=!!i.map,I=!!i.matcap,ee=!!x,te=!!i.aoMap,L=!!i.lightMap,R=!!i.bumpMap&&i.wireframe===!1,z=!!i.normalMap,B=!!i.displacementMap,ne=!!i.emissiveMap,V=!!i.metalnessMap,H=!!i.roughnessMap,re=i.anisotropy>0,ie=i.clearcoat>0,ae=i.dispersion>0,oe=i.retroreflectivity>0,se=i.iridescence>0,ce=i.sheen>0,le=i.transmission>0,U=re&&!!i.anisotropyMap,ue=ie&&!!i.clearcoatMap,de=ie&&!!i.clearcoatNormalMap,fe=ie&&!!i.clearcoatRoughnessMap,W=se&&!!i.iridescenceMap,pe=se&&!!i.iridescenceThicknessMap,me=ce&&!!i.sheenColorMap,he=ce&&!!i.sheenRoughnessMap,ge=!!i.specularMap,_e=!!i.specularColorMap,ve=!!i.specularIntensityMap,ye=le&&!!i.transmissionMap,be=le&&!!i.thicknessMap,G=!!i.gradientMap,xe=!!i.alphaMap,Se=i.alphaTest>0,Ce=!!i.alphaHash,we=!!i.extensions,Te=0;i.toneMapped&&(j===null||j.isXRRenderTarget===!0)&&(Te=e.toneMapping);let Ee={shaderID:C,shaderType:i.type,shaderName:i.name,vertexShader:D,fragmentShader:O,defines:i.defines,customVertexShaderID:k,customFragmentShaderID:A,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:f,batching:P,batchingColor:P&&h._colorsTexture!==null,instancing:N,instancingColor:N&&h.instanceColor!==null,instancingMorph:N&&h.morphTexture!==null,outputColorSpace:j===null?e.outputColorSpace:j.isXRRenderTarget===!0?j.texture.colorSpace:mn.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:F,matcap:I,envMap:ee,envMapMode:ee&&x.mapping,envMapCubeUVHeight:S,aoMap:te,lightMap:L,bumpMap:R,normalMap:z,displacementMap:B,emissiveMap:ne,normalMapObjectSpace:z&&i.normalMapType===1,normalMapTangentSpace:z&&i.normalMapType===0,packedNormalMap:z&&i.normalMapType===0&&bu(i.normalMap.format),metalnessMap:V,roughnessMap:H,anisotropy:re,anisotropyMap:U,clearcoat:ie,clearcoatMap:ue,clearcoatNormalMap:de,clearcoatRoughnessMap:fe,dispersion:ae,retroreflection:oe,iridescence:se,iridescenceMap:W,iridescenceThicknessMap:pe,sheen:ce,sheenColorMap:me,sheenRoughnessMap:he,specularMap:ge,specularColorMap:_e,specularIntensityMap:ve,transmission:le,transmissionMap:ye,thicknessMap:be,gradientMap:G,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:xe,alphaTest:Se,alphaHash:Ce,combine:i.combine,mapUv:F&&m(i.map.channel),aoMapUv:te&&m(i.aoMap.channel),lightMapUv:L&&m(i.lightMap.channel),bumpMapUv:R&&m(i.bumpMap.channel),normalMapUv:z&&m(i.normalMap.channel),displacementMapUv:B&&m(i.displacementMap.channel),emissiveMapUv:ne&&m(i.emissiveMap.channel),metalnessMapUv:V&&m(i.metalnessMap.channel),roughnessMapUv:H&&m(i.roughnessMap.channel),anisotropyMapUv:U&&m(i.anisotropyMap.channel),clearcoatMapUv:ue&&m(i.clearcoatMap.channel),clearcoatNormalMapUv:de&&m(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fe&&m(i.clearcoatRoughnessMap.channel),iridescenceMapUv:W&&m(i.iridescenceMap.channel),iridescenceThicknessMapUv:pe&&m(i.iridescenceThicknessMap.channel),sheenColorMapUv:me&&m(i.sheenColorMap.channel),sheenRoughnessMapUv:he&&m(i.sheenRoughnessMap.channel),specularMapUv:ge&&m(i.specularMap.channel),specularColorMapUv:_e&&m(i.specularColorMap.channel),specularIntensityMapUv:ve&&m(i.specularIntensityMap.channel),transmissionMapUv:ye&&m(i.transmissionMap.channel),thicknessMapUv:be&&m(i.thicknessMap.channel),alphaMapUv:xe&&m(i.alphaMap.channel),vertexTangents:!!v.attributes.tangent&&(z||re),vertexNormals:!!v.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!v.attributes.color&&v.attributes.color.itemSize===4,pointsUvs:h.isPoints===!0&&!!v.attributes.uv&&(F||xe),fog:!!_,useFog:i.fog===!0,fogExp2:!!_&&_.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||v.attributes.normal===void 0&&z===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:M,skinning:h.isSkinnedMesh===!0,hasPositionAttribute:v.attributes.position!==void 0,morphTargets:v.morphAttributes.position!==void 0,morphNormals:v.morphAttributes.normal!==void 0,morphColors:v.morphAttributes.color!==void 0,morphTargetsCount:T,morphTextureStride:E,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:g.length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Te,decodeVideoTexture:F&&i.map.isVideoTexture===!0&&mn.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:ne&&i.emissiveMap.isVideoTexture===!0&&mn.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:we&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(we&&i.extensions.multiDraw===!0||P)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ee.vertexUv1s=c.has(1),Ee.vertexUv2s=c.has(2),Ee.vertexUv3s=c.has(3),c.clear(),Ee}function g(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(_(n,t),v(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function _(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapCubeUVHeight),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.morphAttributeCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function v(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function y(e){let t=p[e.type],n;if(t){let e=Hs[t];n=vo.clone(e.uniforms)}else n=e.uniforms;return n}function b(t,n){let r=u.get(n);return r===void 0?(r=new gu(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function x(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function S(e){s.remove(e)}function C(){s.dispose()}return{getParameters:h,getProgramCacheKey:g,getUniforms:y,acquireProgram:b,releaseProgram:x,releaseShaderCache:S,programs:l,dispose:C}}function Su(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Cu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function wu(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Tu(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Cu),r.length>1&&r.sort(t||wu),i.length>1&&i.sort(t||wu)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Eu(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Tu,e.set(t,[i])):n>=r.length?(i=new Tu,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Du(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new Z,color:new dr};break;case`SpotLight`:n={position:new Z,direction:new Z,color:new dr,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new Z,color:new dr,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new Z,skyColor:new dr,groundColor:new dr};break;case`RectAreaLight`:n={color:new dr,position:new Z,halfWidth:new Z,halfHeight:new Z}}return e[t.id]=n,n}}}function Ou(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var ku=0;function Au(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function ju(e){let t=new Du,n=Ou(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new Z);let i=new Z,a=new An,o=new An;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Au);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=ku++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Mu(e){let t=new ju(e),n=[],r=[],i=[];function a(e){d.camera=e,n.length=0,r.length=0,i.length=0}function o(e){n.push(e)}function s(e){r.push(e)}function c(e){i.push(e)}function l(){t.setup(n)}function u(e){t.setupView(n,e)}let d={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:d,setupLights:l,setupLightsView:u,pushLight:o,pushShadow:s,pushLightProbeGrid:c}}function Nu(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Mu(e),t.set(n,[a])):r>=i.length?(a=new Mu(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Pu=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fu=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Iu=[new Z(1,0,0),new Z(-1,0,0),new Z(0,1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1)],Lu=[new Z(0,-1,0),new Z(0,-1,0),new Z(0,0,1),new Z(0,0,-1),new Z(0,-1,0),new Z(0,-1,0)],Ru=new An,zu=new Z,Bu=new Z;function Vu(e,t,n){let r=new Ri,i=new X,a=new X,o=new Tn,s=new To,c=new Eo,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new xo({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new X},radius:{value:4}},vertexShader:Pu,fragmentShader:Fu}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new si;m.setAttribute(`position`,new Kr(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new ji(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(Y(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){Y(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){Y(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new Dn(i.x,i.y,{format:Se,type:de,minFilter:H,magFilter:H,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Vi(i.x,i.y,ue),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=ye,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=B,d.map.depthTexture.magFilter=B}else l.isPointLight?(d.map=new vc(i.x),d.map.depthTexture=new Hi(i.x,U)):(d.map=new Dn(i.x,i.y),d.map.depthTexture=new Vi(i.x,i.y,U)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=ye,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=H,d.map.depthTexture.magFilter=H):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=B,d.map.depthTexture.magFilter=B);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),zu.setFromMatrixPosition(l.matrixWorld),e.position.copy(zu),Bu.copy(e.position),Bu.add(Iu[t]),e.up.copy(Lu[t]),e.lookAt(Bu),e.updateMatrixWorld(),n.makeTranslation(-zu.x,-zu.y,-zu.z),Ru.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Ru,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new Dn(i.x,i.y,{format:Se,type:de}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s){if(n.visible===!1)return;if(n.layers.test(i.layers)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&s===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),c=n.material;if(Array.isArray(c)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=c[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,s);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(c.visible){let t=y(n,c,o,s);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let c=n.children;for(let e=0,t=c.length;e<t;e++)b(c[e],i,a,o,s)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Hu(e,t){function n(){let t=!1,n=new Tn,r=null,i=new Tn(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?V(e.DEPTH_TEST):H(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=At[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?V(e.STENCIL_TEST):H(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c=new WeakMap,l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new dr(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,M=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),N=!1,P=0,F=e.getParameter(e.VERSION);F.indexOf(`WebGL`)===-1?F.indexOf(`OpenGL ES`)!==-1&&(P=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),N=P>=2):(P=parseFloat(/^WebGL (\d)/.exec(F)[1]),N=P>=1);let I=null,ee={},te=e.getParameter(e.SCISSOR_BOX),L=e.getParameter(e.VIEWPORT),R=new Tn().fromArray(te),z=new Tn().fromArray(L);function B(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let ne={};ne[e.TEXTURE_2D]=B(e.TEXTURE_2D,e.TEXTURE_2D,1),ne[e.TEXTURE_CUBE_MAP]=B(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[e.TEXTURE_2D_ARRAY]=B(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),ne[e.TEXTURE_3D]=B(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),V(e.DEPTH_TEST),o.setFunc(3),U(!1),ue(1),V(e.CULL_FACE),ce(0);function V(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function H(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function re(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function ie(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function ae(t){return h!==t&&(e.useProgram(t),h=t,!0)}let oe={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};oe[103]=e.MIN,oe[104]=e.MAX;let se={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ce(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(H(e.BLEND),g=!1);else if(g===!1&&(V(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Dt(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:Dt(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:Dt(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:Dt(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(oe[n],oe[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(se[r],se[i],se[o],se[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function le(t,n){t.side===2?H(e.CULL_FACE):V(e.CULL_FACE);let r=t.side===1;n&&(r=!r),U(r),t.blending===1&&t.transparent===!1?ce(0):ce(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),fe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?V(e.SAMPLE_ALPHA_TO_COVERAGE):H(e.SAMPLE_ALPHA_TO_COVERAGE)}function U(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ue(t){t===0?H(e.CULL_FACE):(V(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function de(t){t!==k&&(N&&e.lineWidth(t),k=t)}function fe(t,n,r){t?(V(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n),e.polygonOffset(n,r))):H(e.POLYGON_OFFSET_FILL)}function W(t){t?V(e.SCISSOR_TEST):H(e.SCISSOR_TEST)}function pe(t){t===void 0&&(t=e.TEXTURE0+M-1),I!==t&&(e.activeTexture(t),I=t)}function me(t,n,r){r===void 0&&(r=I===null?e.TEXTURE0+M-1:I);let i=ee[r];i===void 0&&(i={type:void 0,texture:void 0},ee[r]=i),(i.type!==t||i.texture!==n)&&(I!==r&&(e.activeTexture(r),I=r),e.bindTexture(t,n||ne[t]),i.type=t,i.texture=n)}function he(){let t=ee[I];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function ge(){try{e.compressedTexImage2D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function _e(){try{e.compressedTexImage3D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function ve(){try{e.texSubImage2D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function ye(){try{e.texSubImage3D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function be(){try{e.compressedTexSubImage2D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function G(){try{e.compressedTexSubImage3D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function xe(){try{e.texStorage2D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function Se(){try{e.texStorage3D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function Ce(){try{e.texImage2D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function we(){try{e.texImage3D(...arguments)}catch(e){Dt(`WebGLState:`,e)}}function Te(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ee(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function K(t){R.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),R.copy(t))}function De(t){z.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),z.copy(t))}function q(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),r.set(t,i))}function Oe(t,n){let r=l.get(n).get(t);c.get(n)!==r&&(e.uniformBlockBinding(n,r,t.__bindingPointIndex),c.set(n,r))}function ke(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},I=null,ee={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new dr(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,R.set(0,0,e.canvas.width,e.canvas.height),z.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:V,disable:H,bindFramebuffer:re,drawBuffers:ie,useProgram:ae,setBlending:ce,setMaterial:le,setFlipSided:U,setCullFace:ue,setLineWidth:de,setPolygonOffset:fe,setScissorTest:W,activeTexture:pe,bindTexture:me,unbindTexture:he,compressedTexImage2D:ge,compressedTexImage3D:_e,texImage2D:Ce,texImage3D:we,pixelStorei:Ee,getParameter:Te,updateUBOMapping:q,uniformBlockBinding:Oe,texStorage2D:xe,texStorage3D:Se,texSubImage2D:ve,texSubImage3D:ye,compressedTexSubImage2D:be,compressedTexSubImage3D:G,scissor:K,viewport:De,reset:ke}}function Uu(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new X,u=new WeakMap,d=new Set,f,p=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function h(e,t){return m?new OffscreenCanvas(e,t):St(`canvas`)}function g(e,t,n){let r=1,i=Te(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=h(n,a));let o=t?h(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),Y(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&Y(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function _(e){return e.generateMipmaps}function v(t){e.generateMipmap(t)}function y(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function b(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];Y(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||Y(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?ht:mn.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function x(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,Y(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function S(e,t){return _(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps!==void 0&&e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function C(e){let t=e.target;t.removeEventListener(`dispose`,C),T(t),t.isVideoTexture&&u.delete(t),t.isHTMLTexture&&d.delete(t)}function w(e){let t=e.target;t.removeEventListener(`dispose`,w),D(t)}function T(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&E(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function E(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function D(t){let n=r.get(t);if(t.depthTexture&&(t.depthTexture.dispose(),r.remove(t.depthTexture)),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let i=t.textures;for(let t=0,n=i.length;t<n;t++){let n=r.get(i[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(i[t])}r.remove(t)}let O=0;function k(){O=0}function A(){return O}function j(e){O=e}function M(){let e=O;return e>=i.maxTextures&&Y(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),O+=1,e}function N(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function P(t,i){let a=r.get(t);if(t.isVideoTexture&&Ce(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)Y(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)Y(`WebGLRenderer: Texture marked for update but image is incomplete`);else{ue(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function F(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ue(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function I(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?ue(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function ee(t,i){let a=r.get(t);t.isCubeDepthTexture!==!0&&t.version>0&&a.__version!==t.version?de(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let te={[L]:e.REPEAT,[R]:e.CLAMP_TO_EDGE,[z]:e.MIRRORED_REPEAT},ae={[B]:e.NEAREST,[ne]:e.NEAREST_MIPMAP_NEAREST,[V]:e.NEAREST_MIPMAP_LINEAR,[H]:e.LINEAR,[re]:e.LINEAR_MIPMAP_NEAREST,[ie]:e.LINEAR_MIPMAP_LINEAR},oe={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function se(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&Y(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,te[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,te[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,te[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,ae[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,ae[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,oe[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function ce(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,C));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=N(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&E(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function le(e,t,n){return Math.floor(Math.floor(e/n)/t)}function U(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=le(n.start,r.width,4),c=le(t.start,r.width,4);n.start<=i+1&&a===c&&le(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function ue(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=ce(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=mn.getPrimaries(mn.workingColorSpace),r=o.colorSpace===``?null:mn.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=g(o.image,!1,i.maxTextureSize);t=we(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=b(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);se(c,o);let h,y=o.mipmaps,C=o.isVideoTexture!==!0,w=f.__version===void 0||l===!0,T=u.dataReady,E=S(o,t);if(o.isDepthTexture)m=x(o.format===be,o.type),w&&(C?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(y.length>0){C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else C?(w&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&U(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){C&&w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,y[0].width,y[0].height,t.depth);for(let i=0,a=y.length;i<a;i++)if(h=y[i],o.format!==1023){if(r!==null){if(C){if(T){if(o.layerUpdates.size>0){let t=Ls(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else C?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{C&&w&&n.texStorage2D(e.TEXTURE_2D,E,m,y[0].width,y[0].height);for(let t=0,i=y.length;t<i;t++)h=y[t],o.format===1023?C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):C?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(C){if(w&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Ls(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)C?(w&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(w){if(C)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(y.length>0){if(C&&w){let t=Te(y[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=y.length;t<i;t++)h=y[t],C?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(C){if(w){let r=Te(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);_(o)&&v(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function de(t,o,s){if(o.image.length!==6)return;let c=ce(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=mn.getPrimaries(mn.workingColorSpace),r=o.colorSpace===``?null:mn.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=g(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=we(o,m[e]);let h=m[0],y=a.convert(o.format,o.colorSpace),x=a.convert(o.type),C=b(o.internalFormat,y,x,o.normalized,o.colorSpace),w=o.isVideoTexture!==!0,T=u.__version===void 0||c===!0,E=l.dataReady,D=S(o,h);se(e.TEXTURE_CUBE_MAP,o);let O;if(f){w&&T&&n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,h.width,h.height);for(let t=0;t<6;t++){O=m[t].mipmaps;for(let r=0;r<O.length;r++){let i=O[r];o.format===1023?w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,y,x,i.data):y===null?Y(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):w?E&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,y,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,C,i.width,i.height,0,i.data)}}}else{if(O=o.mipmaps,w&&T){O.length>0&&D++;let t=Te(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,D,C,t.width,t.height)}for(let t=0;t<6;t++)if(p){w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,y,x,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,m[t].width,m[t].height,0,y,x,m[t].data);for(let r=0;r<O.length;r++){let i=O[r].image[t].image;w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,y,x,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,i.width,i.height,0,y,x,i.data)}}else{w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,y,x,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,C,y,x,m[t]);for(let r=0;r<O.length;r++){let i=O[r];w?E&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,y,x,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,C,y,x,i.image[t])}}}_(o)&&v(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function fe(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=b(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),Se(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,xe(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function W(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=x(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;Se(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,xe(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,xe(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=b(o.internalFormat,c,l,o.normalized,o.colorSpace);Se(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,xe(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,xe(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function pe(t,i,o){let c=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let l=r.get(i.depthTexture);if(l.__renderTarget=i,l.__webglTexture&&i.depthTexture.image.width===i.width&&i.depthTexture.image.height===i.height||(i.depthTexture.image.width=i.width,i.depthTexture.image.height=i.height,i.depthTexture.needsUpdate=!0),c){if(l.__webglInit===void 0&&(l.__webglInit=!0,i.depthTexture.addEventListener(`dispose`,C)),l.__webglTexture===void 0){l.__webglTexture=e.createTexture(),n.bindTexture(e.TEXTURE_CUBE_MAP,l.__webglTexture),se(e.TEXTURE_CUBE_MAP,i.depthTexture);let t=a.convert(i.depthTexture.format),r=a.convert(i.depthTexture.type),o;i.depthTexture.format===1026?o=e.DEPTH_COMPONENT24:i.depthTexture.format===1027&&(o=e.DEPTH24_STENCIL8);for(let n=0;n<6;n++)e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0,o,i.width,i.height,0,t,r,null)}}else P(i.depthTexture,0);let u=l.__webglTexture,d=xe(i),f=c?e.TEXTURE_CUBE_MAP_POSITIVE_X+o:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)Se(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)Se(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function me(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)pe(i.__webglFramebuffer[e],t,e);else{let e=t.texture.mipmaps;e&&e.length>0?pe(i.__webglFramebuffer[0],t,0):pe(i.__webglFramebuffer,t,0)}}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),W(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else{let r=t.texture.mipmaps;if(r&&r.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),W(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function he(t,n,i){let a=r.get(t);n!==void 0&&fe(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&me(t)}function ge(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,w);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps&&i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&Se(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=b(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=xe(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),W(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),se(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps&&i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)fe(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else fe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);_(i)&&v(e.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),se(c,a),fe(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),_(a)&&v(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),se(r,i),i.mipmaps&&i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)fe(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else fe(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);_(i)&&v(r),n.unbindTexture()}t.depthBuffer&&me(t)}function _e(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(_(a)){let t=y(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),v(t),n.unbindTexture()}}}let ve=[],ye=[];function G(t){if(t.samples>0){if(Se(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer);let f=t.texture.mipmaps;f&&f.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(ve.length=0,ye.length=0,ve.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&(ve.push(l),ye.push(l),e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,ye)),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ve))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function xe(e){return Math.min(i.maxSamples,e.samples)}function Se(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function Ce(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function we(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(mn.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&Y(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):Dt(`WebGLTextures: Unsupported texture color space:`,n)),t}function Te(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=M,this.resetTextureUnits=k,this.getTextureUnits=A,this.setTextureUnits=j,this.setTexture2D=P,this.setTexture2DArray=F,this.setTexture3D=I,this.setTextureCube=ee,this.rebindTextures=he,this.setupRenderTarget=ge,this.updateRenderTargetMipmap=_e,this.updateMultisampleRenderTarget=G,this.setupDepthRenderbuffer=me,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=Se,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function Wu(e,t){function n(n,r=``){let i,a=mn.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Gu=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ku=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,qu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Ui(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new xo({vertexShader:Gu,fragmentShader:Ku,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ji(new co(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Ju=class extends jt{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new qu,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new X,C=null,w=null,T=new as;T.viewport=new Tn;let E=new as;E.viewport=new Tn;let D=[T,E],O=new fs,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new or,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new or,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new or,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function M(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,M),r.removeEventListener(`inputsourceschange`,N);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,z.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&Y(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,M),r.addEventListener(`inputsourceschange`,N),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?be:ye,a=_.stencil?pe:U);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Dn(d.textureWidth,d.textureHeight,{format:ve,type:ae,depthTexture:new Vi(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Dn(f.framebufferWidth,f.framebufferHeight,{format:ve,type:ae,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),z.setContext(r),z.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function N(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}let P=new Z,F=new Z;function I(e,t,n){P.setFromMatrixPosition(t.matrixWorld),F.setFromMatrixPosition(n.matrixWorld);let r=P.distanceTo(F),i=t.projectionMatrix.elements,a=n.projectionMatrix.elements,o=i[14]/(i[10]-1),s=i[14]/(i[10]+1),c=(i[9]+1)/i[5],l=(i[9]-1)/i[5],u=(i[8]-1)/i[0],d=(a[8]+1)/a[0],f=o*u,p=o*d,m=r/(-u+d),h=m*-u;if(t.matrixWorld.decompose(e.position,e.quaternion,e.scale),e.translateX(h),e.translateZ(m),e.matrixWorld.compose(e.position,e.quaternion,e.scale),e.matrixWorldInverse.copy(e.matrixWorld).invert(),i[10]===-1)e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse);else{let t=o+m,n=s+m,i=f-h,a=p+(r-h),u=c*s/n*t,d=l*s/n*t;e.projectionMatrix.makePerspective(i,a,u,d,t,n),e.projectionMatrixInverse.copy(e.projectionMatrix).invert()}}function ee(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;ee(O,i);for(let e=0;e<a.length;e++)ee(a[e],i);a.length===2?I(O,T,E):O.projectionMatrix.copy(T.projectionMatrix),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),te(e,O,i)};function te(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=Ft*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let L=null;function R(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new as,o.layers.enable(n),o.viewport=new Tn,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Ui,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}L&&L(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let z=new zs;z.setAnimationLoop(R),this.setAnimationLoop=function(e){L=e},this.dispose=function(){}}},Yu=new An,Xu=new ln;Xu.set(-1,0,0,0,1,0,0,0,1);function Zu(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,_o(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Yu.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Xu),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessRange[0],e.iridescenceThicknessMaximum.value=t.iridescenceThicknessRange[1],t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Qu(e,t,n,r){let i={},a={},o=[],s=e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);function c(e,t){let n=t.program;r.uniformBlockBinding(e,n)}function l(e,n){let o=i[e.id];o===void 0&&(g(e),o=u(e),i[e.id]=o,e.addEventListener(`dispose`,v));let s=n.program;r.updateUBOMapping(e,s);let c=t.render.frame;a[e.id]!==c&&(f(e),a[e.id]=c)}function u(t){let n=d();t.__bindingPointIndex=n;let r=e.createBuffer(),i=t.__size,a=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,r),e.bufferData(e.UNIFORM_BUFFER,i,a),e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBufferBase(e.UNIFORM_BUFFER,n,r),r}function d(){for(let e=0;e<s;e++)if(o.indexOf(e)===-1)return o.push(e),e;return Dt(`WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.`),0}function f(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)p(t[n],e,n,a);else p(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function p(t,n,r,i){if(h(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=_(i);m(i,t.__data,e),typeof i!=`number`&&typeof i!=`boolean`&&!i.isMatrix3&&!ArrayBuffer.isView(i)&&(e+=a.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function m(e,t,n){typeof e==`number`||typeof e==`boolean`?t[0]=e:e.isMatrix3?(t[0]=e.elements[0],t[1]=e.elements[1],t[2]=e.elements[2],t[3]=0,t[4]=e.elements[3],t[5]=e.elements[4],t[6]=e.elements[5],t[7]=0,t[8]=e.elements[6],t[9]=e.elements[7],t[10]=e.elements[8],t[11]=0):ArrayBuffer.isView(e)?t.set(new e.constructor(e.buffer,e.byteOffset,t.length)):e.toArray(t,n)}function h(e,t,n,r){let i=e.value,a=t+`_`+n;if(r[a]===void 0)return r[a]=typeof i==`number`||typeof i==`boolean`?i:ArrayBuffer.isView(i)?i.slice():i.clone(),!0;{let e=r[a];if(typeof i==`number`||typeof i==`boolean`){if(e!==i)return r[a]=i,!0}else if(ArrayBuffer.isView(i))return!0;else if(e.equals(i)===!1)return e.copy(i),!0}return!1}function g(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let e=0,t=r.length;e<t;e++){let t=r[e],i=Array.isArray(t.value)?t.value:[t.value];for(let e=0,r=i.length;e<r;e++){let r=i[e],a=_(r),o=n%16,s=o%a.boundary,c=o+s;n+=s,c!==0&&16-c<a.storage&&(n+=16-c),t.__data=new Float32Array(a.storage/Float32Array.BYTES_PER_ELEMENT),t.__offset=n,n+=a.storage}}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function _(e){let t={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(t.boundary=4,t.storage=4):e.isVector2?(t.boundary=8,t.storage=8):e.isVector3||e.isColor?(t.boundary=16,t.storage=12):e.isVector4?(t.boundary=16,t.storage=16):e.isMatrix3?(t.boundary=48,t.storage=48):e.isMatrix4?(t.boundary=64,t.storage=64):e.isTexture?Y(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(t.boundary=16,t.storage=e.byteLength):Y(`WebGLRenderer: Unsupported uniform value type.`,e),t}function v(t){let n=t.target;n.removeEventListener(`dispose`,v);let r=o.indexOf(n.__bindingPointIndex);o.splice(r,1),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function y(){for(let t in i)e.deleteBuffer(i[t]);o=[],i={},a={}}return{bind:c,update:l,dispose:y}}var $u=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ed=null;function td(){return ed===null&&(ed=new Pi($u,16,16,Se,de),ed.name=`DFG_LUT`,ed.minFilter=H,ed.magFilter=H,ed.wrapS=R,ed.wrapT=R,ed.generateMipmaps=!1,ed.needsUpdate=!0),ed}var nd=class{constructor(e={}){let{canvas:t=Ct(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=ae}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([we,Ce,xe]),g=new Set([ae,U,ce,pe,fe,W]),_=new Uint32Array(4),v=new Int32Array(4),y=new Z,b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=pt;let j=0,M=0,N=null,P=-1,F=null,I=new Tn,ee=new Tn,te=null,L=new dr(0),R=0,z=t.width,B=t.height,ne=1,V=null,H=null,re=new Tn(0,0,z,B),oe=new Tn(0,0,z,B),se=!1,le=new Ri,ue=!1,me=!1,he=new An,ge=new Z,_e=new Tn,ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ye=!1;function be(){return N===null?ne:1}let G=n;function Se(e,n){return t.getContext(e,n)}let Te,Ee,K,De,q,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r186`),t.addEventListener(`webglcontextlost`,qe,!1),t.addEventListener(`webglcontextrestored`,Je,!1),t.addEventListener(`webglcontextcreationerror`,Ye,!1),G===null){let t=`webgl2`;if(G=Se(t,e),G===null)throw Se(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ke()}catch(e){throw t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),Dt(`WebGLRenderer: `+e.message),e}function Ke(){Te=new bc(G),Te.init(),Ue=new Wu(G,Te),Ee=new Ys(G,Te,e,Ue),K=new Hu(G,Te),Ee.reversedDepthBuffer&&d&&K.buffers.depth.setReversed(!0),O=G.createFramebuffer(),k=G.createFramebuffer(),A=G.createFramebuffer(),De=new Cc(G),q=new Su,Oe=new Uu(G,Te,K,q,Ee,Ue,De),ke=new yc(T),Ae=new Bs(G),We=new qs(G,Ae),je=new xc(G,Ae,De,We),Me=new Tc(G,je,Ae,We,De),Be=new wc(G,Ee,Oe),Le=new Xs(q),Ne=new xu(T,ke,Te,Ee,We,Le),Pe=new Zu(T,q),Fe=new Eu,Ie=new Nu(Te),ze=new Ks(T,ke,K,Me,p,s),Re=new Vu(T,Me,Ee),Ge=new Qu(G,De,Ee,K),Ve=new Js(G,Te,De),He=new Sc(G,Te,De),De.programs=Ne.programs,T.capabilities=Ee,T.extensions=Te,T.properties=q,T.renderLists=Fe,T.shadowMap=Re,T.state=K,T.info=De}m!==1009&&(w=new Dc(m,t.width,t.height,o,r,i));let J=new Ju(T,G);this.xr=J,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(e){e!==void 0&&(ne=e,this.setSize(z,B,!1))},this.getSize=function(e){return e.set(z,B)},this.setSize=function(e,n,r=!0){J.isPresenting?Y(`WebGLRenderer: Can't change size while VR device is presenting.`):(z=e,B=n,t.width=Math.floor(e*ne),t.height=Math.floor(n*ne),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(z*ne,B*ne).floor()},this.setDrawingBufferSize=function(e,n,r){z=e,B=n,ne=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)Dt(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){Y(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(I)},this.getViewport=function(e){return e.copy(re)},this.setViewport=function(e,t,n,r){e.isVector4?re.set(e.x,e.y,e.z,e.w):re.set(e,t,n,r),K.viewport(I.copy(re).multiplyScalar(ne).round())},this.getScissor=function(e){return e.copy(oe)},this.setScissor=function(e,t,n,r){e.isVector4?oe.set(e.x,e.y,e.z,e.w):oe.set(e,t,n,r),K.scissor(ee.copy(oe).multiplyScalar(ne).round())},this.getScissorTest=function(){return se},this.setScissorTest=function(e){K.setScissorTest(se=e)},this.setOpaqueSort=function(e){V=e},this.setTransparentSort=function(e){H=e},this.getClearColor=function(e){return e.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(N!==null){let t=N.texture.format;e=h.has(t)}if(e){let e=N.texture.type,t=g.has(e),n=ze.getClearColor(),r=ze.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,G.clearBufferuiv(G.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,G.clearBufferiv(G.COLOR,0,v))}else r|=G.COLOR_BUFFER_BIT}t&&(r|=G.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&G.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),ze.dispose(),Fe.dispose(),Ie.dispose(),q.dispose(),ke.dispose(),Me.dispose(),We.dispose(),Ge.dispose(),Ne.dispose(),J.dispose(),J.removeEventListener(`sessionstart`,nt),J.removeEventListener(`sessionend`,rt),it.stop()};function qe(e){e.preventDefault(),Tt(`WebGLRenderer: Context Lost.`),E=!0}function Je(){Tt(`WebGLRenderer: Context Restored.`),E=!1;let e=De.autoReset,t=Re.enabled,n=Re.autoUpdate,r=Re.needsUpdate,i=Re.type;Ke(),De.autoReset=e,Re.enabled=t,Re.autoUpdate=n,Re.needsUpdate=r,Re.type=i}function Ye(e){Dt(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Xe(e){let t=e.target;t.removeEventListener(`dispose`,Xe),Ze(t)}function Ze(e){Qe(e),q.remove(e)}function Qe(e){let t=q.get(e).programs;t!==void 0&&(t.forEach(function(e){Ne.releaseProgram(e)}),e.isShaderMaterial&&Ne.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=ve);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=ht(e,t,n,r,i);K.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=je.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;We.setup(i,r,s,n,c);let h,g=Ve;if(c!==null&&(h=Ae.get(c),g=He,g.setIndex(h)),i.isMesh)r.wireframe===!0?(K.setLineWidth(r.wireframeLinewidth*be()),g.setMode(G.LINES)):g.setMode(G.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),K.setLineWidth(e*be()),i.isLineSegments?g.setMode(G.LINES):i.isLineLoop?g.setMode(G.LINE_LOOP):g.setMode(G.LINE_STRIP)}else i.isPoints?g.setMode(G.POINTS):i.isSprite&&g.setMode(G.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?Ae.get(c).bytesPerElement:1,o=q.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(G,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function $e(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),ue===!0&&Le.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,ut(e,t,r),e.side=0,e.needsUpdate=!0,ut(e,t,r),e.side=2):ut(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Ie.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),me=this.localClippingEnabled,ue=Le.init(this.clippingPlanes,me),ue===!0&&Le.setGlobalState(this.clippingPlanes,t),D!==null&&Re.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];$e(o,n,t,e),r.add(o)}else $e(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=q.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let et=null;function tt(e){et&&et(e)}function nt(){it.stop()}function rt(){it.start()}let it=new zs;it.setAnimationLoop(tt),typeof self<`u`&&it.setContext(self),this.setAnimationLoop=function(e){et=e,J.setAnimationLoop(e),e===null?it.stop():it.start()},J.addEventListener(`sessionstart`,nt),J.addEventListener(`sessionend`,rt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){Dt(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=J.enabled===!0&&J.isPresenting===!0,r=w!==null&&(N===null||n)&&w.begin(T,N);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),J.enabled===!0&&J.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(J.cameraAutoUpdate===!0&&J.updateCamera(t),t=J.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,N),x=Ie.get(e,C.length),x.init(t),x.state.textureUnits=Oe.getTextureUnits(),C.push(x),he.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),le.setFromProjectionMatrix(he,yt,t.reversedDepth),me=this.localClippingEnabled,ue=Le.init(this.clippingPlanes,me),b=Fe.get(e,S.length),b.init(),S.push(b),J.enabled===!0&&J.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&at(e,t,-1/0,T.sortObjects)}at(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(V,H),ye=J.enabled===!1||J.isPresenting===!1||J.hasDepthSensing()===!1,ye&&ze.addToRenderList(b,e),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ue===!0&&Le.beginShadows();let i=x.state.shadowsArray;if(Re.render(i,e,t),ue===!0&&Le.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];st(n,r,e,a)}ye&&ze.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];ot(b,e,n,n.viewport)}}else r.length>0&&st(n,r,e,t),ye&&ze.render(e),ot(b,e,t)}N!==null&&M===0&&(Oe.updateMultisampleRenderTarget(N),Oe.updateRenderTargetMipmap(N)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),We.resetDefaultState(),P=-1,F=null,C.pop(),C.length>0?(x=C[C.length-1],Oe.setTextureUnits(x.state.textureUnits),ue===!0&&Le.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function at(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLightProbeGrid)x.pushLightProbeGrid(e);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){if(!e.frustumCulled||e.intersectsFrustum(le)){r&&_e.setFromMatrixPosition(e.matrixWorld).applyMatrix4(he);let i=Me.update(e),a=e.material;a.visible&&b.push(e,i,a,n,_e.z,null,t)}}else if((e.isMesh||e.isLine||e.isPoints)&&(!e.frustumCulled||e.intersectsFrustum(le))){let i=Me.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),_e.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),_e.copy(e.boundingSphere.center)),_e.applyMatrix4(e.matrixWorld).applyMatrix4(he)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,_e.z,s,t)}}else a.visible&&b.push(e,i,a,n,_e.z,null,t)}}let i=e.children;for(let e=0,a=i.length;e<a;e++)at(i[e],t,n,r)}function ot(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ue===!0&&Le.setGlobalState(T.clippingPlanes,n),r&&K.viewport(I.copy(r)),i.length>0&&ct(i,t,n),a.length>0&&ct(a,t,n),o.length>0&&ct(o,t,n),K.buffers.depth.setTest(!0),K.buffers.depth.setMask(!0),K.buffers.color.setMask(!0),K.setPolygonOffset(!1)}function st(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new Dn(1,1,{generateMipmaps:!0,type:e?de:ae,minFilter:ie,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:mn.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||I;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(L),R=T.getClearAlpha(),R<1&&T.setClearColor(16777215,.5),T.clear(),ye&&ze.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ue===!0&&Le.setGlobalState(T.clippingPlanes,r),ct(e,n,r),Oe.updateMultisampleRenderTarget(a),Oe.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,lt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(Oe.updateMultisampleRenderTarget(a),Oe.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(L,R),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&lt(o,t,n,s,l,c)}}function lt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function ut(e,t,n){t.isScene!==!0&&(t=ve);let r=q.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Ne.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Ne.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=ke.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Xe),l=new Map,r.programs=l);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return ft(e,s),d}else s.uniforms=Ne.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Ne.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Le.uniform),ft(e,s),r.needsLights=_t(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.lightProbeGrid=x.state.lightProbeGridArray.length>0,r.currentProgram=d,r.uniformsList=null,d}function dt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Pl.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function ft(e,t){let n=q.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function mt(e,t){if(e.length===0)return null;if(e.length===1)return e[0].texture===null?null:e[0];y.setFromMatrixPosition(t.matrixWorld);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n.texture!==null&&n.boundingBox.containsPoint(y))return n}return null}function ht(e,t,n,r,i){t.isScene!==!0&&(t=ve),Oe.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=N===null?T.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:mn.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=ke.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=q.get(r),y=x.state.lights;if(ue===!0&&(me===!0||e!==F)){let t=e===F&&r.id===P;Le.setState(r,e,t)}let b=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==y.state.version?b=!0:v.outputColorSpace===s?i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?b=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Le.numPlanes||v.numIntersection!==Le.numIntersection)?b=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.toneMapping===h&&v.morphTargetsCount===_?!!v.lightProbeGrid!=x.state.lightProbeGridArray.length>0&&(b=!0):b=!0:b=!0:b=!0:(b=!0,v.__version=r.version);let S=v.currentProgram;b===!0&&(S=ut(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,S,v));let C=!1,w=!1,E=!1,O=S.getUniforms(),k=v.uniforms;if(K.useProgram(S.program)&&(C=!0,w=!0,E=!0),r.id!==P&&(P=r.id,w=!0),v.needsLights){let e=mt(x.state.lightProbeGridArray,i);v.lightProbeGrid!==e&&(v.lightProbeGrid=e,w=!0)}if(C||F!==e){K.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),O.setValue(G,`projectionMatrix`,e.projectionMatrix),O.setValue(G,`viewMatrix`,e.matrixWorldInverse);let t=O.map.cameraPosition;t!==void 0&&t.setValue(G,ge.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&O.setValue(G,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&O.setValue(G,`isOrthographic`,e.isOrthographicCamera===!0),F!==e&&(F=e,w=!0,E=!0)}if(v.needsLights&&(y.state.sunShadowMap.length>0&&O.setValue(G,`sunShadowMap`,y.state.sunShadowMap,Oe),y.state.directionalShadowMap.length>0&&O.setValue(G,`directionalShadowMap`,y.state.directionalShadowMap,Oe),y.state.spotShadowMap.length>0&&O.setValue(G,`spotShadowMap`,y.state.spotShadowMap,Oe),y.state.pointShadowMap.length>0&&O.setValue(G,`pointShadowMap`,y.state.pointShadowMap,Oe)),i.isSkinnedMesh){O.setOptional(G,i,`bindMatrix`),O.setOptional(G,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),O.setValue(G,`boneTexture`,e.boneTexture,Oe))}i.isBatchedMesh&&(O.setOptional(G,i,`batchingTexture`),O.setValue(G,`batchingTexture`,i._matricesTexture,Oe),O.setOptional(G,i,`batchingIdTexture`),O.setValue(G,`batchingIdTexture`,i._indirectTexture,Oe),O.setOptional(G,i,`batchingColorTexture`),i._colorsTexture!==null&&O.setValue(G,`batchingColorTexture`,i._colorsTexture,Oe));let A=n.morphAttributes;if((A.position!==void 0||A.normal!==void 0||A.color!==void 0)&&Be.update(i,n,S),(w||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,O.setValue(G,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(k.envMapIntensity.value=t.environmentIntensity),k.dfgLUT!==void 0&&(k.dfgLUT.value=td()),w){if(O.setValue(G,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&gt(k,E),a&&r.fog===!0&&Pe.refreshFogUniforms(k,a),Pe.refreshMaterialUniforms(k,r,ne,B,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.lightProbeGrid){let e=v.lightProbeGrid;k.probesSH.value=e.texture,k.probesMin.value.copy(e.boundingBox.min),k.probesMax.value.copy(e.boundingBox.max),k.probesResolution.value.copy(e.resolution)}Pl.upload(G,dt(v),k,Oe)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Pl.upload(G,dt(v),k,Oe),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&O.setValue(G,`center`,i.center),O.setValue(G,`modelViewMatrix`,i.modelViewMatrix),O.setValue(G,`normalMatrix`,i.normalMatrix),O.setValue(G,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];Ge.update(n,S),Ge.bind(n,S)}}return S}function gt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function _t(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(e,t,n){let r=q.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),q.get(e.texture).__webglTexture=t,q.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=q.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){N=e,j=t,M=n;let r=null,i=!1,a=!1;if(e){let o=q.get(e);if(o.__useDefaultFramebuffer!==void 0){K.bindFramebuffer(G.FRAMEBUFFER,o.__webglFramebuffer),I.copy(e.viewport),ee.copy(e.scissor),te=e.scissorTest,K.viewport(I),K.scissor(ee),K.setScissorTest(te),P=-1;return}if(o.__webglFramebuffer===void 0)Oe.setupRenderTarget(e);else if(o.__hasExternalTextures)Oe.rebindTextures(e,q.get(e.texture).__webglTexture,q.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&q.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);Oe.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=q.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&Oe.useMultisampledRTT(e)===!1?q.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,I.copy(e.viewport),ee.copy(e.scissor),te=e.scissorTest}else I.copy(re).multiplyScalar(ne).floor(),ee.copy(oe).multiplyScalar(ne).floor(),te=se;if(n!==0&&(r=O),K.bindFramebuffer(G.FRAMEBUFFER,r)&&K.drawBuffers(e,r),K.viewport(I),K.scissor(ee),K.setScissorTest(te),i){let r=q.get(e.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=q.get(e.textures[t]);G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=q.get(e.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,t.__webglTexture,n)}P=-1};function vt(e){let t=q.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ee.textureFormatReadable(e.format),t.__typeReadable=Ee.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){Dt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=q.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){K.bindFramebuffer(G.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+s);let u=vt(o);if(u.__formatReadable===!1){Dt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){Dt(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&G.readPixels(t,n,r,i,Ue.convert(c),Ue.convert(l),a)}finally{let e=N===null?null:q.get(N).__webglFramebuffer;K.bindFramebuffer(G.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=q.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o]),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){K.bindFramebuffer(G.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+s);let d=vt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,f),G.bufferData(G.PIXEL_PACK_BUFFER,a.byteLength,G.STREAM_READ),G.readPixels(t,n,r,i,Ue.convert(l),Ue.convert(u),0),G.bindBuffer(G.PIXEL_PACK_BUFFER,null);let p=N===null?null:q.get(N).__webglFramebuffer;K.bindFramebuffer(G.FRAMEBUFFER,p);let m=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await kt(G,m,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,f),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,a),G.bindBuffer(G.PIXEL_PACK_BUFFER,null),G.deleteBuffer(f),G.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;Oe.setTexture2D(e,0),G.copyTexSubImage2D(G.TEXTURE_2D,n,0,0,o,s,i,a),K.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=Ue.convert(t.format),_=Ue.convert(t.type),v;t.isData3DTexture?(Oe.setTexture3D(t,0),v=G.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(Oe.setTexture2DArray(t,0),v=G.TEXTURE_2D_ARRAY):(Oe.setTexture2D(t,0),v=G.TEXTURE_2D),K.activeTexture(G.TEXTURE0),K.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,t.flipY),K.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),K.pixelStorei(G.UNPACK_ALIGNMENT,t.unpackAlignment);let y=K.getParameter(G.UNPACK_ROW_LENGTH),b=K.getParameter(G.UNPACK_IMAGE_HEIGHT),x=K.getParameter(G.UNPACK_SKIP_PIXELS),S=K.getParameter(G.UNPACK_SKIP_ROWS),C=K.getParameter(G.UNPACK_SKIP_IMAGES);K.pixelStorei(G.UNPACK_ROW_LENGTH,h.width),K.pixelStorei(G.UNPACK_IMAGE_HEIGHT,h.height),K.pixelStorei(G.UNPACK_SKIP_PIXELS,l),K.pixelStorei(G.UNPACK_SKIP_ROWS,u),K.pixelStorei(G.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=q.get(e),r=q.get(t),h=q.get(n.__renderTarget),g=q.get(r.__renderTarget);K.bindFramebuffer(G.READ_FRAMEBUFFER,h.__webglFramebuffer),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,q.get(e).__webglTexture,i,d+n),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,q.get(t).__webglTexture,a,m+n)),G.blitFramebuffer(l,u,o,s,f,p,o,s,G.DEPTH_BUFFER_BIT,G.NEAREST);K.bindFramebuffer(G.READ_FRAMEBUFFER,null),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||q.has(e)){let n=q.get(e),r=q.get(t);K.bindFramebuffer(G.READ_FRAMEBUFFER,k),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,n.__webglTexture,i),T?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,r.__webglTexture,a),i===0?T?G.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):G.copyTexSubImage2D(v,a,f,p,l,u,o,s):G.blitFramebuffer(l,u,o,s,f,p,o,s,G.COLOR_BUFFER_BIT,G.NEAREST);K.bindFramebuffer(G.READ_FRAMEBUFFER,null),K.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?G.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?G.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):G.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):G.texSubImage2D(G.TEXTURE_2D,a,f,p,o,s,g,_,h);K.pixelStorei(G.UNPACK_ROW_LENGTH,y),K.pixelStorei(G.UNPACK_IMAGE_HEIGHT,b),K.pixelStorei(G.UNPACK_SKIP_PIXELS,x),K.pixelStorei(G.UNPACK_SKIP_ROWS,S),K.pixelStorei(G.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps&&G.generateMipmap(v),K.unbindTexture()},this.initRenderTarget=function(e){q.get(e).__webglFramebuffer===void 0&&Oe.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?Oe.setTextureCube(e,0):e.isData3DTexture?Oe.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?Oe.setTexture2DArray(e,0):Oe.setTexture2D(e,0),K.unbindTexture()},this.resetState=function(){j=0,M=0,N=null,K.reset(),We.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return yt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=mn._getDrawingBufferColorSpace(e),t.unpackColorSpace=mn._getUnpackColorSpace()}},rd=0,id=1,ad=new Z,od=new Is,sd=new di,cd=new Z,ld=new Dr,ud=class{constructor(){this.tolerance=-1,this.faces=[],this.newFaces=[],this.assigned=new md,this.unassigned=new md,this.vertices=[]}setFromPoints(e){if(e.length>=4){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.vertices.push(new pd(e[t]));this._compute()}return this}setFromObject(e){let t=[];return e.updateMatrixWorld(!0),e.traverse(function(e){let n=e.geometry;if(n!==void 0){let r=n.attributes.position;if(r!==void 0)for(let n=0,i=r.count;n<i;n++){let i=new Z;i.fromBufferAttribute(r,n).applyMatrix4(e.matrixWorld),t.push(i)}}}),this.setFromPoints(t)}containsPoint(e){let t=this.faces;for(let n=0,r=t.length;n<r;n++)if(t[n].distanceToPoint(e)>this.tolerance)return!1;return!0}intersectRay(e,t){let n=this.faces,r=-1/0,i=1/0;for(let t=0,a=n.length;t<a;t++){let a=n[t],o=a.distanceToPoint(e.origin),s=a.normal.dot(e.direction);if(o>0&&s>=0)return null;let c=s===0?0:-o/s;if(!(c<=0)&&(s>0?i=Math.min(c,i):r=Math.max(c,r),r>i))return null}return r===-1/0?e.at(i,t):e.at(r,t),t}intersectsRay(e){return this.intersectRay(e,ad)!==null}makeEmpty(){return this.faces=[],this.vertices=[],this}_addVertexToFace(e,t){return e.face=t,t.outside===null?this.assigned.append(e):this.assigned.insertBefore(t.outside,e),t.outside=e,this}_removeVertexFromFace(e,t){return e===t.outside&&(t.outside=e.next!==null&&e.next.face===t?e.next:null),this.assigned.remove(e),this}_removeAllVerticesFromFace(e){if(e.outside!==null){let t=e.outside,n=e.outside;for(;n.next!==null&&n.next.face===e;)n=n.next;return this.assigned.removeSubList(t,n),t.prev=n.next=null,e.outside=null,t}}_deleteFaceVertices(e,t){let n=this._removeAllVerticesFromFace(e);if(n!==void 0){if(t===void 0)this.unassigned.appendChain(n);else{let e=n;do{let n=e.next;t.distanceToPoint(e.point)>this.tolerance?this._addVertexToFace(e,t):this.unassigned.append(e),e=n}while(e!==null)}}return this}_resolveUnassignedPoints(e){if(this.unassigned.isEmpty()===!1){let t=this.unassigned.first();do{let n=t.next,r=this.tolerance,i=null;for(let n=0;n<e.length;n++){let a=e[n];if(a.mark===rd){let e=a.distanceToPoint(t.point);if(e>r&&(r=e,i=a),r>1e3*this.tolerance)break}}i!==null&&this._addVertexToFace(t,i),t=n}while(t!==null)}return this}_computeExtremes(){let e=new Z,t=new Z,n=[],r=[];for(let e=0;e<3;e++)n[e]=r[e]=this.vertices[0];e.copy(this.vertices[0].point),t.copy(this.vertices[0].point);for(let i=0,a=this.vertices.length;i<a;i++){let a=this.vertices[i],o=a.point;for(let t=0;t<3;t++)o.getComponent(t)<e.getComponent(t)&&(e.setComponent(t,o.getComponent(t)),n[t]=a);for(let e=0;e<3;e++)o.getComponent(e)>t.getComponent(e)&&(t.setComponent(e,o.getComponent(e)),r[e]=a)}return this.tolerance=3*2**-52*(Math.max(Math.abs(e.x),Math.abs(t.x))+Math.max(Math.abs(e.y),Math.abs(t.y))+Math.max(Math.abs(e.z),Math.abs(t.z))),{min:n,max:r}}_computeInitialHull(){let e=this.vertices,t=this._computeExtremes(),n=t.min,r=t.max,i=0,a=0;for(let e=0;e<3;e++){let t=r[e].point.getComponent(e)-n[e].point.getComponent(e);t>i&&(i=t,a=e)}let o=n[a],s=r[a],c,l;i=0,od.set(o.point,s.point);for(let t=0,n=this.vertices.length;t<n;t++){let n=e[t];if(n!==o&&n!==s){od.closestPointToPoint(n.point,!0,cd);let e=cd.distanceToSquared(n.point);e>i&&(i=e,c=n)}}i=-1,sd.setFromCoplanarPoints(o.point,s.point,c.point);for(let t=0,n=this.vertices.length;t<n;t++){let n=e[t];if(n!==o&&n!==s&&n!==c){let e=Math.abs(sd.distanceToPoint(n.point));e>i&&(i=e,l=n)}}let u=[];if(sd.distanceToPoint(l.point)<0){u.push(dd.create(o,s,c),dd.create(l,s,o),dd.create(l,c,s),dd.create(l,o,c));for(let e=0;e<3;e++){let t=(e+1)%3;u[e+1].getEdge(2).setTwin(u[0].getEdge(t)),u[e+1].getEdge(1).setTwin(u[t+1].getEdge(0))}}else{u.push(dd.create(o,c,s),dd.create(l,o,s),dd.create(l,s,c),dd.create(l,c,o));for(let e=0;e<3;e++){let t=(e+1)%3;u[e+1].getEdge(2).setTwin(u[0].getEdge((3-e)%3)),u[e+1].getEdge(0).setTwin(u[t+1].getEdge(1))}}for(let e=0;e<4;e++)this.faces.push(u[e]);for(let t=0,n=e.length;t<n;t++){let n=e[t];if(n!==o&&n!==s&&n!==c&&n!==l){i=this.tolerance;let e=null;for(let t=0;t<4;t++){let r=this.faces[t].distanceToPoint(n.point);r>i&&(i=r,e=this.faces[t])}e!==null&&this._addVertexToFace(n,e)}}return this}_reindexFaces(){let e=[];for(let t=0;t<this.faces.length;t++){let n=this.faces[t];n.mark===rd&&e.push(n)}return this.faces=e,this}_nextVertexToAdd(){if(this.assigned.isEmpty()===!1){let e,t=0,n=this.assigned.first().face,r=n.outside;do{let i=n.distanceToPoint(r.point);i>t&&(t=i,e=r),r=r.next}while(r!==null&&r.face===n);return e}}_computeHorizon(e,t,n,r){this._deleteFaceVertices(n),n.mark=id;let i;i=t===null?t=n.getEdge(0):t.next;do{let t=i.twin,n=t.face;n.mark===rd&&(n.distanceToPoint(e)>this.tolerance?this._computeHorizon(e,t,n,r):r.push(i)),i=i.next}while(i!==t);return this}_addAdjoiningFace(e,t){let n=dd.create(e,t.tail(),t.head());return this.faces.push(n),n.getEdge(-1).setTwin(t.twin),n.getEdge(0)}_addNewFaces(e,t){this.newFaces=[];let n=null,r=null;for(let i=0;i<t.length;i++){let a=t[i],o=this._addAdjoiningFace(e,a);n===null?n=o:o.next.setTwin(r),this.newFaces.push(o.face),r=o}return n.next.setTwin(r),this}_addVertexToHull(e){let t=[];return this.unassigned.clear(),this._removeVertexFromFace(e,e.face),this._computeHorizon(e.point,null,e.face,t),this._addNewFaces(e,t),this._resolveUnassignedPoints(this.newFaces),this}_cleanup(){return this.assigned.clear(),this.unassigned.clear(),this.newFaces=[],this}_compute(){let e;for(this._computeInitialHull();(e=this._nextVertexToAdd())!==void 0;)this._addVertexToHull(e);return this._reindexFaces(),this._cleanup(),this}},dd=class e{constructor(){this.normal=new Z,this.midpoint=new Z,this.area=0,this.constant=0,this.outside=null,this.mark=rd,this.edge=null}static create(t,n,r){let i=new e,a=new fd(t,i),o=new fd(n,i),s=new fd(r,i);return a.next=s.prev=o,o.next=a.prev=s,s.next=o.prev=a,i.edge=a,i.compute()}getEdge(e){let t=this.edge;for(;e>0;)t=t.next,e--;for(;e<0;)t=t.prev,e++;return t}compute(){let e=this.edge.tail(),t=this.edge.head(),n=this.edge.next.head();return ld.set(e.point,t.point,n.point),ld.getNormal(this.normal),ld.getMidpoint(this.midpoint),this.area=ld.getArea(),this.constant=this.normal.dot(this.midpoint),this}distanceToPoint(e){return this.normal.dot(e)-this.constant}},fd=class{constructor(e,t){this.vertex=e,this.prev=null,this.next=null,this.twin=null,this.face=t}head(){return this.vertex}tail(){return this.prev?this.prev.vertex:null}length(){let e=this.head(),t=this.tail();return t===null?-1:t.point.distanceTo(e.point)}lengthSquared(){let e=this.head(),t=this.tail();return t===null?-1:t.point.distanceToSquared(e.point)}setTwin(e){return this.twin=e,e.twin=this,this}},pd=class{constructor(e){this.point=e,this.prev=null,this.next=null,this.face=null}},md=class{constructor(){this.head=null,this.tail=null}first(){return this.head}last(){return this.tail}clear(){return this.head=this.tail=null,this}insertBefore(e,t){return t.prev=e.prev,t.next=e,t.prev===null?this.head=t:t.prev.next=t,e.prev=t,this}insertAfter(e,t){return t.prev=e,t.next=e.next,t.next===null?this.tail=t:t.next.prev=t,e.next=t,this}append(e){return this.head===null?this.head=e:this.tail.next=e,e.prev=this.tail,e.next=null,this.tail=e,this}appendChain(e){for(this.head===null?this.head=e:this.tail.next=e,e.prev=this.tail;e.next!==null;)e=e.next;return this.tail=e,this}remove(e){return e.prev===null?this.head=e.next:e.prev.next=e.next,e.next===null?this.tail=e.prev:e.next.prev=e.prev,this}removeSubList(e,t){return e.prev===null?this.head=t.next:e.prev.next=t.next,t.next===null?this.tail=e.prev:t.next.prev=e.prev,this}isEmpty(){return this.head===null}};function hd(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var gd=.4,_d=2.5,vd=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
`,yd=`#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID & 1) << 2), float((gl_VertexID & 2) << 1));
  gl_Position = vec4(p - 1.0, 0.0, 1.0);
}`,bd=`
uniform sampler2D uS0; // height, coverage, stroke the coverage belongs to, deposit (see stamp)
uniform sampler2D uS1; // top colour rgb, gloss
uniform sampler2D uS2; // translucency, grain, pore filling, fruit pieces
uniform sampler2D uS3; // what lies under the top layer: colour rgb, how much it covers the bread
uniform sampler2D uLoad; // the knife's load (r) and the last deposit stamp's scale (g)
uniform vec3 uColor;     // the knife's spread
uniform float uStroke;

// how much the colour m is the spread colour: 1 the same, falling with the distance
float sameColour(vec3 m) {
  float dist = abs(m.r - uColor.r) + abs(m.g - uColor.g) + abs(m.b - uColor.b);
  return max(0.0, 1.0 - dist * 2.5);
}
`,xd=`
bool noNumber(float v) {
  return (floatBitsToUint(v) & 0x7f800000u) == 0x7f800000u;
}
bool bad(float v) {
  return noNumber(v) || !(abs(v) < 1e4);
}
bool bad(vec4 v) {
  return bad(v.r) || bad(v.g) || bad(v.b) || bad(v.a);
}
`,Sd=`
  if (bad(o0.r) || bad(o0.g) || bad(o0.a)) {
    o0 = vec4(0.0, 0.0, uStroke, 0.0);
    o3 = vec4(0.0);
  }
  if (bad(o1)) o1 = vec4(uColor, 0.0);
  if (bad(o2)) o2 = vec4(0.0);
  if (bad(o3)) o3 = vec4(0.0);
`,Cd=vd+bd+xd+`
uniform sampler2D uField; // slice mask, edge noise, patch noise
uniform sampler2D uRidge; // blade profile across: broad waves, comb lines
uniform int uN;
uniform int uRidgeHalf;
uniform float uFilmMin;
uniform float uDepRate;
uniform float uHalfW;
uniform float uHalfL;
uniform float uTapFeather;
uniform int uLevelStep;  // stride of the local mean, in cells (wider on a finer grid)
// the spread
uniform float uCapacity;
uniform float uFilmMax;
uniform float uPatchy;
uniform float uFeather;
uniform float uEdgeNoise;
uniform float uRidgeAmp;
uniform float uCombAmp;
uniform float uLevelK;
uniform float uScrape;
// the stamp
uniform bool uRound;     // the tap's round dab instead of the blade
uniform float uRadius;
uniform vec2 uC;         // centre
uniform vec2 uD;         // stroke direction
uniform vec2 uCombD;     // the comb's frame
uniform vec2 uCombC;
uniform int uDepK;       // > 0: also lays down, for this many stamps
uniform ivec2 uTapOff[4];
uniform vec2 uTapF[4];
uniform ivec2 uBack;     // the cell a shift behind
uniform bool uBackFirst; // ... comes before this one in row order
uniform float uShift;
uniform float uHalfSp;

layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
layout(location = 2) out vec4 o2;
layout(location = 3) out vec4 o3;

// 1 - smoothstep(t), with e = 1 - t computed separately by the caller: in
// float the plain form cancels to 0 at the outer edge, where the cell should
// still be touched (and take the spread's colour, as in the double-precision
// CPU version this was tuned with); inside the plain form, which reaches full
// coverage exactly
float fadeOut(float t, float e) {
  if (t < 0.5) {
    t = max(t, 0.0);
    return 1.0 - t * t * (3.0 - 2.0 * t);
  }
  e = max(e, 0.0);
  return e * e * (3.0 - 2.0 * e);
}

float covAt(ivec2 c) {
  vec4 s = texelFetch(uS0, c, 0);
  return s.b == uStroke ? s.g : 0.0;
}

float hAt(ivec2 c) {
  return texelFetch(uS0, c, 0).r;
}

float bilinear(ivec2 c, vec2 f) {
  return (hAt(c) * (1.0 - f.x) + hAt(c + ivec2(1, 0)) * f.x) * (1.0 - f.y) +
    (hAt(c + ivec2(0, 1)) * (1.0 - f.x) + hAt(c + ivec2(1, 1)) * f.x) * f.y;
}

// the blade's coverage of cell c (signed distance to the capsule, wobbled by
// the edge noise, feathered); u is the position across the blade
float blade(ivec2 c, float m, float noise, float fa, float en, out float u) {
  vec2 p = vec2(c) + 0.5 - uC;
  u = p.x * -uD.y + p.y * uD.x;
  float v = p.x * uD.x + p.y * uD.y;
  float du = max(abs(u) - (uHalfW - uHalfL), 0.0);
  float dEdge = sqrt(du * du + v * v) - uHalfL + noise * en;
  if (dEdge > fa) return 0.0;
  return fadeOut((dEdge + fa) / (2.0 * fa), (fa - dEdge) / (2.0 * fa)) * m;
}

// a deposit candidate: laid down in the last pass, scaled to the knife's load.
// Its mix weight on top is this increment's share of the coverage still
// missing, so after full coverage the cell is the new spread whatever the
// increments were (mixing by increment left cells 70 % or 100 % new
// depending on their phase against the stamp grid, and the next stroke
// turned that colour ripple into a height ripple)
void queue(float h, float cov, float s, float add) {
  float inc = s - cov;
  float onTop = 1.0 - cov > 1e-4 ? min(1.0, inc / (1.0 - cov)) : 1.0;
  o0 = vec4(h, s, -1.0 - onTop - (cov <= 0.0 ? 2.0 : 0.0), add);
}

void stamp() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 s0 = texelFetch(uS0, c, 0);
  vec4 m1 = texelFetch(uS1, c, 0);
  vec4 m3 = texelFetch(uS3, c, 0);
  float cov = s0.b == uStroke ? s0.g : 0.0;
  o0 = vec4(s0.r, cov, uStroke, 0.0);
  o1 = m1;
  o2 = texelFetch(uS2, c, 0);
  o3 = m3;
  vec4 f = texelFetch(uField, c, 0);
  float m = f.r;
  if (m <= 0.0) return;
  float lf = texelFetch(uLoad, ivec2(0), 0).r / uCapacity;
  float film = uFilmMin + (uFilmMax - uFilmMin) * smoothstep(0.0, 1.0, min(1.0, lf));

  if (uRound) {
    // a tap: the knife tip touching down pulls the height towards half the film
    float r = length(vec2(c) + 0.5 - uC);
    float s = fadeOut((r - uRadius + uTapFeather) / (2.0 * uTapFeather), (uRadius + uTapFeather - r) / (2.0 * uTapFeather)) * m;
    if (s - cov <= 0.0) return;
    o0.g = s;
    float cur = s0.r;
    float same = cur > 0.02 ? sameColour(m1.rgb) : 1.0;
    float d = cur * (1.0 - same) + film * 0.5 - cur;
    if (d > 0.0) queue(cur, cov, s, d * (s - cov) * uDepRate);
    return;
  }

  // With little on the knife a firm spread no longer lays an even film: the
  // edges fray and tear, and the butter only sticks in tongues along the
  // stroke (reference photos: "Zungen und Flecken"). Runny spreads keep their film.
  float thin = uPatchy * (1.0 - smoothstep(0.02, 0.4, lf));
  float fa = uFeather * (1.0 + ${gd.toFixed(4)} * thin);
  float en = uEdgeNoise * (1.0 + ${_d.toFixed(4)} * thin);
  float u;
  float s = blade(c, m, f.g, fa, en, u);
  if (s <= 0.0) return;

  // Advection: take the value from a little way back along the stroke. Read
  // as a box over one stamp step (shift - step/2 and shift + step/2), and
  // likewise around the cell itself, which the blade irons along its travel:
  // when the material moves more than one step per stamp the deposit bands
  // overtake each other, and a single read left a ripple with the step's
  // period that a later stroke dragged along its whole length. (Two taps per
  // box, at offsets the same for every cell of the stamp.)
  float h = s0.r;
  vec3 top = m1.rgb;
  vec4 und = m3;
  float x = float(c.x);
  float y = float(c.y);
  float nf = float(uN);
  float lim = uShift + uHalfSp + 1.0;
  if (x - lim >= 0.0 && y - lim >= 0.0 && x + lim + 1.0 < nf && y + lim + 1.0 < nf) {
    float loc = 0.5 * bilinear(c + uTapOff[0], uTapF[0]) + 0.5 * bilinear(c + uTapOff[1], uTapF[1]);
    float back = 0.5 * bilinear(c + uTapOff[2], uTapF[2]) + 0.5 * bilinear(c + uTapOff[3], uTapF[3]);
    h = h + (loc - h) * s * 0.6;
    ivec2 bc = c + uBack;
    float covB = covAt(bc);
    if (uBackFirst && uDepK > 0 && covB <= 0.0) {
      // a cell behind that comes earlier in row order counts as covered by
      // this stamp already (the CPU version this was tuned with visited the
      // cells row by row)
      vec4 fb = texelFetch(uField, bc, 0);
      float ub;
      if (fb.r > 0.0 && blade(bc, fb.r, fb.g, fa, en, ub) > 0.0) covB = 1.0;
    }
    // bare bread behind the touchdown must not be dragged into the stroke's
    // start: the blade leaves its film there, it does not thin it out again
    // (that looked like the stroke fading in)
    if (back > 0.001 || covB > 0.0) {
      // A different spread behind the blade (jam under a butter stroke) is
      // dragged along less far than the knife's own: it streaks into the start
      // of the stroke and then stays behind. Only its colour and its ground
      // travel; gloss, translucency, grain, pore and fruit pieces stay those
      // of the layer the blade lays down (else the butter started as a hazy
      // pink glaze with fruit bits).
      vec4 bt = texelFetch(uS1, bc, 0);
      float sa = s * (0.35 + 0.65 * sameColour(bt.rgb));
      h = h + (back - h) * sa;
      if (back > 0.01) {
        top = top + (bt.rgb - top) * sa;
        und = und + (texelFetch(uS3, bc, 0) - und) * sa;
      }
    }
  }
  o0.r = h;
  o1.rgb = top;
  o3 = und;
  if (uDepK == 0) return;
  float inc = s - cov;
  if (inc <= 0.0) return;
  o0.g = s;

  // coverage per stroke: each cell remembers the highest coverage any stamp
  // of the stroke reached, and only the increase is applied, so the finished
  // stroke has the soft capsule profile whatever the stamp density

  // the blade profile; the comb is read in its own inert frame
  int rMax = 2 * uRidgeHalf;
  int ri = clamp(int(floor(u + 0.5)) + uRidgeHalf, 0, rMax);
  float uc = (x + 0.5 - uCombC.x) * -uCombD.y + (y + 0.5 - uCombC.y) * uCombD.x;
  int rc = clamp(int(floor(uc + 0.5)) + uRidgeHalf, 0, rMax);
  float cur = h;
  // another spread underneath (judged by colour) counts as ground: the blade
  // levels only its own spread, on another it lays a new layer on top
  float same = cur > 0.02 ? sameColour(top) : 1.0;
  float base = cur;
  if (same < 1.0 && uLevelK > 0.0) {
    // a runny spread fills the grooves of what it goes onto (jam over
    // butter's comb lines showed a dot grid): its ground is the local mean of
    // the old surface
    // (7×7 samples, uLevelStep apart)
    float sum = 0.0;
    int cnt = 0;
    for (int kx = -3; kx <= 3; kx++) {
      int xx = c.x + kx * uLevelStep;
      if (xx < 0 || xx >= uN) continue;
      for (int ky = -3; ky <= 3; ky++) {
        int yy = c.y + ky * uLevelStep;
        if (yy < 0 || yy >= uN) continue;
        sum += hAt(ivec2(xx, yy));
        cnt++;
      }
    }
    base = cur + (sum / float(cnt) - cur) * uLevelK * (1.0 - same);
  }
  float target = base * (1.0 - same) + film + texelFetch(uRidge, ivec2(ri, 0), 0).r * uRidgeAmp + texelFetch(uRidge, ivec2(rc, 0), 0).g * uCombAmp;
  float d = target - cur;
  float k = float(uDepK);
  if (d > 0.0) {
    float stick = 1.0;
    if (thin > 0.0) {
      // where a thin layer sticks: the patch noise in the stroke's frame, stretched along it
      float pu = (x * uD.x + y * uD.y) * 0.3;
      float pv = -x * uD.y + y * uD.x;
      int px = min(int(pu - floor(pu / nf) * nf), uN - 1);
      int py = min(int(pv - floor(pv / nf) * nf), uN - 1);
      stick = smoothstep(thin * 0.9 - 0.25, thin * 0.9 + 0.1, texelFetch(uField, ivec2(px, py), 0).b);
    }
    // (one step for k stamps: each would have closed its share of the gap,
    // so the gap shrinks by (1 - inc/k)^k, not by 1 - inc)
    float share = uDepK > 1 ? 1.0 - pow(1.0 - inc / k, k) : inc;
    queue(cur, cov, s, d * share * uDepRate * stick);
  } else if (d < 0.0) {
    float rem = -d * (uDepK > 1 ? 1.0 - pow(1.0 - inc * uScrape / k, k) : inc * uScrape);
    o0 = vec4(cur - rem, s, uStroke, -rem);
  }
}

void main() {
  stamp();
${Sd}}`,wd=vd+`
uniform sampler2D uS0;
uniform int uY0;
uniform int uY1;
out vec4 o;
void main() {
  int x = int(gl_FragCoord.x);
  float demand = 0.0;
  float picked = 0.0;
  for (int y = uY0; y < uY1; y++) {
    float f = texelFetch(uS0, ivec2(x, y), 0).a;
    demand += max(f, 0.0);
    picked += max(-f, 0.0);
  }
  o = vec4(demand, picked, 0.0, 0.0);
}`,Td=vd+xd+`
uniform sampler2D uCols;
uniform sampler2D uLoad;
uniform int uX0;
uniform int uX1;
out vec4 o;
void main() {
  vec2 sum = vec2(0.0);
  for (int x = uX0; x < uX1; x++) sum += texelFetch(uCols, ivec2(x, 0), 0).rg;
  float load = texelFetch(uLoad, ivec2(0), 0).r;
  // (the divisor kept from next to nothing: where a division is one over the
  // divisor times the dividend, as on phones' GPUs, one over that is infinite
  // and an empty knife's nothing times it no number; kept from it, not asked
  // for it first, since a compiler may work out both sides of a choice)
  float scale = sum.r > 0.0 ? min(1.0, load / max(sum.r, 1e-30)) : 0.0;
  o = vec4(max(0.0, load - sum.r * scale + sum.g), scale, 0.0, 0.0);
  // a load that is no number would make every cell under the knife one: the
  // knife is empty then
  if (noNumber(o.r) || noNumber(o.g)) o = vec4(0.0);
}`,Ed=vd+bd+xd+`
uniform float uGloss;
uniform vec4 uPar; // translucency, grain, pore filling, fruit pieces
layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
layout(location = 2) out vec4 o2;
layout(location = 3) out vec4 o3;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  vec4 s0 = texelFetch(uS0, c, 0);
  vec4 m1 = texelFetch(uS1, c, 0);
  vec4 m2 = texelFetch(uS2, c, 0);
  vec4 m3 = texelFetch(uS3, c, 0);
  float scale = texelFetch(uLoad, ivec2(0), 0).g;
  if (s0.b < 0.0 && scale > 0.0) {
    float q = -s0.b - 1.0;
    bool first = q > 1.5;
    float onTop = first ? q - 2.0 : q;
    float cur = s0.r;
    float add = s0.a * scale;
    float same = cur > 0.02 ? sameColour(m1.rgb) : 1.0;
    // (the divisor kept from next to nothing: the heights fade out to 1e-38
    // and less at a spread's rim, and where a division is one over the divisor
    // times the dividend, as on phones' GPUs, one over that is infinite and a
    // deposit of nothing times it no number; see TOTAL)
    float byVolume = cur <= 0.0 ? 1.0 : add / max(cur + add, 1e-30);
    float w = onTop + (byVolume - onTop) * same;
    // a different spread going on top: what was on top becomes the ground under it
    float u = first ? 1.0 - same : 0.0;
    if (u > 0.0 && cur > 0.02) {
      float oldOpaque = (1.0 - m2.r) * (1.0 - exp(-cur * 14.0));
      float oldGround = oldOpaque + m3.a * (1.0 - oldOpaque);
      m3 = m3 + (vec4(m1.rgb, oldGround) - m3) * u;
    }
    m1 = m1 + (vec4(uColor, uGloss) - m1) * w;
    m2 = m2 + (uPar - m2) * w;
    s0.r = cur + add;
  }
  o0 = vec4(s0.r, s0.g, uStroke, 0.0);
  o1 = m1;
  o2 = m2;
  o3 = m3;
${Sd}}`,Dd=vd+`
uniform sampler2D uS0;
uniform sampler2D uS1;
uniform sampler2D uS2;
uniform sampler2D uS3;
uniform float uHeightMax;
layout(location = 0) out vec4 o0;
layout(location = 1) out vec4 o1;
layout(location = 2) out vec4 o2;
layout(location = 3) out vec4 o3;
void main() {
  ivec2 c = ivec2(gl_FragCoord.xy);
  o0 = vec4(texelFetch(uS0, c, 0).r / uHeightMax, 0.0, 0.0, 1.0);
  o1 = texelFetch(uS1, c, 0);
  o2 = texelFetch(uS2, c, 0);
  o3 = texelFetch(uS3, c, 0);
}`,Od={butter:{id:`butter`,color:[.97,.94,.81],gloss:.07,trans:0,grain:0,pore:.5,patchy:1,chunk:0,ridge:1,comb:1,filmMax:.55,capacityMul:1,advect:1,scrapeRate:.25,feather:9,edgeNoise:3},jam:{id:`jam`,color:[.6,.05,.09],gloss:.9,trans:.65,grain:0,pore:1,patchy:.1,chunk:1,ridge:.06,comb:0,filmMax:.32,capacityMul:.7,advect:1.5,scrapeRate:.15,feather:5,edgeNoise:2},nutella:{id:`nutella`,color:[.3,.16,.09],gloss:.95,trans:0,grain:0,pore:.8,patchy:.3,chunk:0,ridge:.3,comb:.2,filmMax:.45,capacityMul:.9,advect:1.1,scrapeRate:.45,feather:4,edgeNoise:3},quark:{id:`quark`,color:[.97,.97,.95],gloss:0,trans:0,grain:.35,pore:.3,patchy:.7,chunk:0,ridge:.5,comb:.3,filmMax:.75,capacityMul:1.4,advect:.8,scrapeRate:.2,feather:8,edgeNoise:5},leberwurst:{id:`leberwurst`,color:[.66,.5,.45],gloss:0,trans:0,grain:.9,pore:.2,patchy:.9,chunk:0,ridge:1.3,comb:.8,filmMax:.6,capacityMul:1.1,advect:.55,scrapeRate:.3,feather:5,edgeNoise:8}},kd={size:512,bladeWidth:104,bladeLength:10,feather:9,filmMin:.05,depositRate:1,capacity:15e3,stampSpacing:2,heightMax:1};function Ad(e){let t=e/512,n=kd;return{...n,size:e,bladeWidth:n.bladeWidth*t,bladeLength:n.bladeLength*t,feather:n.feather*t,capacity:n.capacity*t*t,stampSpacing:n.stampSpacing*t}}function jd(e,t,n){let r=new Float32Array(e*e),i=hd(n);for(let n=0;n<2;n++){let a=n===0?t:t/2.3,o=n===0?.7:.3,s=Math.ceil(e/a)+2,c=new Float32Array(s*s);for(let e=0;e<c.length;e++)c[e]=i()*2-1;for(let t=0;t<e;t++){let n=t/a,i=Math.floor(n),l=n-i,u=l*l*(3-2*l);for(let n=0;n<e;n++){let l=n/a,d=Math.floor(l),f=l-d,p=f*f*(3-2*f),m=c[i*s+d],h=c[i*s+d+1],g=c[(i+1)*s+d],_=c[(i+1)*s+d+1],v=(m*(1-p)+h*p)*(1-u)+(g*(1-p)+_*p)*u;r[t*e+n]=r[t*e+n]+v*o}}}return r}function Md(e){let t=e.length,n=new Uint32Array(1),r=new Float32Array(n.buffer),i=new Uint32Array(t),a=new Uint32Array(65537);for(let o=0;o<t;o++){r[0]=e[o]===0?0:e[o];let t=n[0];i[o]=(t&2147483648?2147483647-(t&2147483647):t+2147483648)>>>0,a[(i[o]&65535)+1]++}for(let e=0;e<65536;e++)a[e+1]+=a[e];let o=new Uint32Array(t);for(let e=0;e<t;e++)o[a[i[e]&65535]++]=e;a.fill(0);for(let e=0;e<t;e++)a[(i[o[e]]>>>16)+1]++;for(let e=0;e<65536;e++)a[e+1]+=a[e];let s=new Uint32Array(t);for(let e=0;e<t;e++)s[a[i[o[e]]>>>16]++]=o[e];let c=new Float32Array(t),l=1/(t-1);for(let e=0;e<t;e++)c[s[e]]=e*l;return c}var Nd=5.5,Pd=.018;function Fd(e,t,n){let r=Math.ceil(e/2+t)+1,i=new Float32Array(2*r+1),a=new Float32Array(2*r+1),o=hd(1337),s=1.6+o()*.8,c=3.2+o()*1,l=6.5+o()*1.5,u=o()*6.28,d=o()*6.28,f=o()*6.28,p=new Float32Array(9);for(let e=0;e<9;e++)p[e]=(o()-.5)*2;for(let t=0;t<i.length;t++){let o=t-r,m=o/(e/2),h=(m+1)/2*8,g=Math.max(0,Math.min(8,Math.floor(h))),_=Math.min(8,g+1),v=h-g,y=(1-Math.cos(v*Math.PI))/2,b=p[g]*(1-y)+p[_]*y,x=.007*Math.sin(m*s*3.14+u)+.005*Math.sin(m*c*3.14+d)+.003*Math.sin(m*l*3.14+f)+.007*b;a[t]=Pd*Math.sin(o/(Nd*n)*6.2832+f)*(.7+.3*Math.sin(o/(11*n)*6.2832+u));let S=Math.abs(o)-e/2;x+=.06*Math.exp(-(S*S)/(40*n*n)),i[t]=x}return[i,a]}var Id=12,Ld=12,Rd=36,zd=.97,Bd=[0,4],Vd=8,Hd=9,Ud=[10,11],Wd=12;function Gd(e,t){return e?{x0:Math.min(e.x0,t.x0),y0:Math.min(e.y0,t.y0),x1:Math.max(e.x1,t.x1),y1:Math.max(e.y1,t.y1)}:{...t}}function Kd(e,t){let n=e.createFramebuffer(),r=[],i=0;e.bindFramebuffer(e.FRAMEBUFFER,n);for(let n=0;n<t;n++){let t=e.createTexture();if(r.push(t),e.bindTexture(e.TEXTURE_2D,t),e.texStorage2D(e.TEXTURE_2D,1,e.RGBA32F,4,4),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.TEXTURE_2D,t,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)break;i=n+1}e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(n);for(let t of r)e.deleteTexture(t);return i}function qd(e,t,n,r){let i=`?`,a=``;try{i=String(Kd(e,n)),a=matchMedia(`(pointer: coarse)`).matches?`, touch`:`, no touch`}catch{}return`0x${t.toString(16)}, ${n} targets, ${i} fit, grid ${r}${a}`}var Jd=e=>(e??``).slice(Math.max(0,(e??``).search(/error/i))),Yd=class e{p;n;f;h;spread;spacing;ridge;comb;noise;patch;stroking=!1;lastX=0;lastY=0;dirX=0;dirY=-1;combDirX=0;combDirY=-1;combCX=0;combCY=0;hasDir=!1;startX=0;startY=0;prevX=0;prevY=0;carry=0;sinceDeposit=1/0;textures;onHeights=null;renderer;gl;mask;res;cur=0;loadCur=0;stale=null;stroke=1;knownLoad;loadEpoch=0;loadChanged=!1;loadRead=null;heightRect=null;heightWanted=!1;heightRead=null;dirty=null;shownSpread=null;inGL=!1;allocated=new WeakSet;tapOff=new Int32Array(8);tapF=new Float32Array(8);static create(t,n,r){let i=r.getContext();return!(i instanceof WebGL2RenderingContext)||!i.getExtension(`EXT_color_buffer_float`)||i.getParameter(i.MAX_DRAW_BUFFERS)<4?null:new e(t,n,r)}gpuBytes=0;constructor(e,t,n){if(this.p=t,this.n=t.size,this.f=t.size/512,this.spread=Od.butter,this.spacing=t.stampSpacing,[this.ridge,this.comb]=Fd(t.bladeWidth,Id*this.f,this.f),this.noise=jd(this.n,14*this.f,4242),this.patch=Md(jd(this.n,16*this.f,777)),e.length!==this.n*this.n)throw Error(`mask size mismatch`);this.mask=e,this.renderer=n,this.gl=n.getContext(),this.h=new Float32Array(this.n*this.n),this.knownLoad=this.capacity;let r=()=>new Ui(null);this.textures={height:r(),mat:r(),par:r(),under:r(),field:r()},this.build()}get fill(){return this.knownLoad/this.capacity}refill(e=this.spread){this.spread=e,this.knownLoad=this.capacity,this.loadEpoch++;let t=this.gl;this.enterGL(),t.activeTexture(t.TEXTURE0+Ud[this.loadCur]),t.texSubImage2D(t.TEXTURE_2D,0,0,0,1,1,t.RGBA,t.FLOAT,new Float32Array([this.capacity,0,0,0])),this.leaveGL()}get lastPoint(){return[this.lastX,this.lastY]}get capacity(){return this.p.capacity*this.spread.capacityMul}begin(e,t){this.clearCoverage(),this.stroking=!0,this.lastX=e,this.lastY=t,this.hasDir=!1,this.startX=e,this.startY=t,this.prevX=e,this.prevY=t,this.carry=0,this.sinceDeposit=1/0}moveTo(e,t){if(!this.stroking)return;if(!this.hasDir){let n=e-this.startX,r=t-this.startY,i=Math.hypot(n,r),a=e-this.prevX,o=t-this.prevY,s=Math.hypot(a,o);if(this.prevX=e,this.prevY=t,i<Ld*this.f)return;let c=s>.01?(a*n+o*r)/(s*i):1;if(i<Rd*this.f&&c<zd)return;this.dirX=n/i,this.dirY=r/i,this.combDirX=this.dirX,this.combDirY=this.dirY,this.combCX=this.startX,this.combCY=this.startY,this.hasDir=!0}let n=e-this.lastX,r=t-this.lastY,i=Math.hypot(n,r);if(i<.01)return;let a=n/i,o=r/i;if(a*this.dirX+o*this.dirY<.3&&i>=1.5*this.f)this.dirX=a,this.dirY=o,this.combDirX=a,this.combDirY=o,this.combCX=this.lastX,this.combCY=this.lastY,this.clearCoverage();else{let e=1-Math.exp(-i/(16*this.f)),t=this.dirX+(a-this.dirX)*e,n=this.dirY+(o-this.dirY)*e,r=Math.hypot(t,n)||1;this.dirX=t/r,this.dirY=n/r;let s=1-Math.exp(-i/(40*this.f)),c=this.combDirX+(a-this.combDirX)*s,l=this.combDirY+(o-this.combDirY)*s,u=Math.hypot(c,l)||1;this.combDirX=c/u,this.combDirY=l/u}let s=this.dirX,c=this.dirY,l=this.carry,u=this.p.stampSpacing,d=Math.max(1,Math.round(this.spacing/u));for(;l<=i;){let e=this.lastX+a*l,t=this.lastY+o*l,n=++this.sinceDeposit>=d;if(n){this.sinceDeposit=0;let n=e-this.combCX,r=t-this.combCY,i=n*this.combDirX+r*this.combDirY,a=(-n*this.combDirY+r*this.combDirX)*(1-Math.exp(-(d*u)/(40*this.f)));this.combCX+=this.combDirX*i-this.combDirY*a,this.combCY+=this.combDirY*i+this.combDirX*a}this.stampBlade(e,t,s,c,this.combDirX,this.combDirY,this.combCX,this.combCY,n?d:0),l+=u}this.carry=l-i,this.lastX=e,this.lastY=t,this.leaveGL()}end(){let e=this.stroking&&this.hasDir;return this.stroking&&!this.hasDir&&this.stampTap(this.startX,this.startY),this.stroking=!1,this.leaveGL(),this.heightWanted=!0,e}restore(){this.inGL=!1,this.cur=0,this.loadCur=0,this.stale=null,this.loadRead=null,this.heightRead=null,this.shownSpread=null,this.h.fill(0),this.knownLoad=this.capacity,this.build()}get heightsPending(){return this.heightWanted&&this.heightRect!==null||this.heightRead!==null}takeDirty(){let e=this.gl,t=this.dirty;if(this.dirty=null,this.pollReads(),t){this.enterGL();let n=this.res;e.bindFramebuffer(e.FRAMEBUFFER,n.showFbo),e.viewport(0,0,this.n,this.n),this.scissor(t);let r=this.use(n.showProg);this.bindState(r,this.cur),e.drawArrays(e.TRIANGLES,0,3)}return this.leaveGL(),t}readState(){let e=this.gl,t=this.n;this.enterGL();let n=this.res;e.bindFramebuffer(e.FRAMEBUFFER,n.stateFbo[this.cur]);let r=[];for(let n=0;n<4;n++){let i=new Float32Array(t*t*4);e.readBuffer(e.COLOR_ATTACHMENT0+n),e.readPixels(0,0,t,t,e.RGBA,e.FLOAT,i),r.push(i)}e.readBuffer(e.COLOR_ATTACHMENT0),e.bindFramebuffer(e.FRAMEBUFFER,n.loadFbo[this.loadCur]);let i=new Float32Array(4);e.readPixels(0,0,1,1,e.RGBA,e.FLOAT,i),this.leaveGL();let a=new Float32Array(t*t),o=new Float32Array(t*t*12),[s,c,l,u]=r;for(let e=0;e<t*t;e++){let t=e*4,n=e*12;a[e]=s[t],o.set(c.subarray(t,t+4),n),o.set(l.subarray(t,t+3),n+4),o.set(u.subarray(t,t+4),n+7),o[n+11]=l[t+3]}return{h:a,mat:o,load:i[0]}}finish(){let e=this.gl;this.enterGL(),e.bindFramebuffer(e.FRAMEBUFFER,this.res.loadFbo[this.loadCur]),e.readBuffer(e.COLOR_ATTACHMENT0),e.readPixels(0,0,1,1,e.RGBA,e.FLOAT,new Float32Array(4)),this.leaveGL()}clearCoverage(){this.stroke++}stampBlade(e,t,n,r,i,a,o,s,c){let l=this.p,u=this.n,d=this.spread,f=(d.feather*(1+gd*d.patchy)+d.edgeNoise*(1+_d*d.patchy))*this.f,p=l.bladeWidth/2+f,m=l.bladeLength/2+f,h=Math.abs(r)*p+Math.abs(n)*m+1,g=Math.abs(n)*p+Math.abs(r)*m+1,_=this.clip(Math.floor(e-h),Math.floor(t-g),Math.ceil(e+h)+1,Math.ceil(t+g)+1);if(!_)return;let v=l.stampSpacing,y=v*d.advect,b=v*.5;for(let e=0;e<4;e++){let t=(e<2?0:y)+(e&1?b:-b),i=-n*t,a=-r*t,o=Math.floor(i),s=Math.floor(a);this.tapOff[e*2]=o,this.tapOff[e*2+1]=s,this.tapF[e*2]=i-o,this.tapF[e*2+1]=a-s}let x=Math.round(-n*y),S=Math.round(-r*y);this.enterGL();let C=this.gl,w=this.use(this.res.stamp).u;C.uniform1i(w.uRound,0),C.uniform2f(w.uC,e,t),C.uniform2f(w.uD,n,r),C.uniform2f(w.uCombD,i,a),C.uniform2f(w.uCombC,o,s),C.uniform1i(w.uDepK,c),C.uniform2iv(w.uTapOff,this.tapOff),C.uniform2fv(w.uTapF,this.tapF),C.uniform2i(w.uBack,x,S),C.uniform1i(w.uBackFirst,+(S*u+x<0)),C.uniform1f(w.uShift,y),C.uniform1f(w.uHalfSp,b),this.runStamp(_,c>0)}stampTap(e,t){let n=this.p.bladeWidth*.12,r=n+this.p.feather+1,i=this.clip(Math.floor(e-r),Math.floor(t-r),Math.ceil(e+r)+1,Math.ceil(t+r)+1);if(!i)return;this.enterGL();let a=this.gl,o=this.use(this.res.stamp).u;a.uniform1i(o.uRound,1),a.uniform1f(o.uRadius,n),a.uniform2f(o.uC,e,t),this.runStamp(i,!0)}clip(e,t,n,r){let i=this.n,a={x0:Math.max(0,e),y0:Math.max(0,t),x1:Math.min(i,n),y1:Math.min(i,r)};return a.x0<a.x1&&a.y0<a.y1?a:null}runStamp(e,t){let n=this.gl,r=this.res,i=this.n,a=this.cur,o=1-a,s=r.stamp;if(this.shownSpread!==this.spread&&this.setSpread(),this.bindState(s,a),n.uniform1i(s.u.uLoad,Ud[this.loadCur]),n.bindFramebuffer(n.FRAMEBUFFER,r.stateFbo[o]),n.viewport(0,0,i,i),this.scissor(Gd(this.stale,e)),n.drawArrays(n.TRIANGLES,0,3),t){let t=e.x1-e.x0,s=this.use(r.colsProg);n.uniform1i(s.u.uS0,Bd[o]),n.uniform1i(s.u.uY0,e.y0),n.uniform1i(s.u.uY1,e.y1),n.bindFramebuffer(n.FRAMEBUFFER,r.colsFbo),n.viewport(0,0,i,1),n.scissor(e.x0,0,t,1),n.drawArrays(n.TRIANGLES,0,3),s=this.use(r.total),n.uniform1i(s.u.uLoad,Ud[this.loadCur]),n.uniform1i(s.u.uX0,e.x0),n.uniform1i(s.u.uX1,e.x1),this.loadCur=1-this.loadCur,n.bindFramebuffer(n.FRAMEBUFFER,r.loadFbo[this.loadCur]),n.viewport(0,0,1,1),n.scissor(0,0,1,1),n.drawArrays(n.TRIANGLES,0,3),s=this.use(r.apply),this.bindState(s,o),n.uniform1i(s.u.uLoad,Ud[this.loadCur]),n.bindFramebuffer(n.FRAMEBUFFER,r.stateFbo[a]),n.viewport(0,0,i,i),this.scissor(e),n.drawArrays(n.TRIANGLES,0,3),this.loadChanged=!0}else this.cur=o;this.stale=e,this.dirty=Gd(this.dirty,e),this.heightRect=Gd(this.heightRect,e)}setSpread(){let e=this.gl,t=this.spread,n=this.res.stamp.u;this.use(this.res.apply);let r=this.res.apply.u;e.uniform3f(r.uColor,t.color[0],t.color[1],t.color[2]),e.uniform1f(r.uGloss,t.gloss),e.uniform4f(r.uPar,t.trans,t.grain,t.pore,t.chunk),this.use(this.res.stamp),e.uniform3f(n.uColor,t.color[0],t.color[1],t.color[2]),e.uniform1f(n.uCapacity,this.capacity),e.uniform1f(n.uFilmMax,t.filmMax),e.uniform1f(n.uPatchy,t.patchy),e.uniform1f(n.uFeather,t.feather*this.f),e.uniform1f(n.uEdgeNoise,t.edgeNoise*this.f),e.uniform1f(n.uRidgeAmp,t.ridge),e.uniform1f(n.uCombAmp,t.comb),e.uniform1f(n.uLevelK,t.pore),e.uniform1f(n.uScrape,t.scrapeRate),this.shownSpread=t}bindState(e,t){let n=this.gl,r=Bd[t];n.uniform1i(e.u.uS0,r),n.uniform1i(e.u.uS1,r+1),n.uniform1i(e.u.uS2,r+2),n.uniform1i(e.u.uS3,r+3),e.u.uStroke&&n.uniform1f(e.u.uStroke,this.stroke)}use(e){return this.gl.useProgram(e.prog),e}scissor(e){this.gl.scissor(e.x0,e.y0,e.x1-e.x0,e.y1-e.y0)}enterGL(){if(this.inGL)return;this.inGL=!0;let e=this.gl,t=this.res;e.bindVertexArray(t.vao);for(let t of[e.BLEND,e.CULL_FACE,e.DEPTH_TEST,e.STENCIL_TEST,e.POLYGON_OFFSET_FILL,e.SAMPLE_ALPHA_TO_COVERAGE,e.RASTERIZER_DISCARD,e.DITHER])e.disable(t);e.enable(e.SCISSOR_TEST),e.colorMask(!0,!0,!0,!0),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0);let n=(t,n)=>{e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,n)};for(let e=0;e<2;e++)for(let r=0;r<4;r++)n(Bd[e]+r,t.state[e][r]);n(Vd,t.field),n(Hd,t.ridge),n(Ud[0],t.load[0]),n(Ud[1],t.load[1]),n(Wd,t.cols)}leaveGL(){if(!this.inGL)return;this.inGL=!1;let e=this.gl;e.bindVertexArray(null),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),e.enable(e.DITHER),this.renderer.resetState()}get reading(){return this.heightsPending||this.loadChanged||this.loadRead!==null}pollReads(){let e=this.gl,t=this.res,n=t=>t!==null&&e.getSyncParameter(t.sync,e.SYNC_STATUS)===e.SIGNALED;if(n(this.loadRead)){let n=this.loadRead;this.enterGL();let r=new Float32Array(4);e.bindBuffer(e.PIXEL_PACK_BUFFER,t.loadPbo),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,r),e.deleteSync(n.sync),n.epoch===this.loadEpoch&&(this.knownLoad=r[0]),this.loadRead=null}if(n(this.heightRead)){let n=this.heightRead,{x0:r,y0:i,x1:a,y1:o}=n.rect,s=a-r,c=new Float32Array(s*(o-i)*4);this.enterGL(),e.bindBuffer(e.PIXEL_PACK_BUFFER,t.heightPbo),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,c),e.deleteSync(n.sync);for(let e=i;e<o;e++)for(let t=r;t<a;t++)this.h[e*this.n+t]=c[((e-i)*s+t-r)*4];this.heightRead=null,this.onHeights?.()}this.loadChanged&&!this.loadRead&&(this.loadChanged=!1,this.enterGL(),e.bindFramebuffer(e.FRAMEBUFFER,t.loadFbo[this.loadCur]),this.loadRead=this.readInto(t.loadPbo,{x0:0,y0:0,x1:1,y1:1},this.loadEpoch)),this.heightWanted&&this.heightRect&&!this.heightRead&&(this.heightWanted=!1,this.enterGL(),e.bindFramebuffer(e.FRAMEBUFFER,t.stateFbo[this.cur]),this.heightRead=this.readInto(t.heightPbo,this.heightRect,0),this.heightRect=null)}readInto(e,t,n){let r=this.gl;r.readBuffer(r.COLOR_ATTACHMENT0),r.bindBuffer(r.PIXEL_PACK_BUFFER,e),this.allocated.has(e)||(this.allocated.add(e),r.bufferData(r.PIXEL_PACK_BUFFER,e===this.res.heightPbo?this.n*this.n*16:16,r.STREAM_COPY)),r.readPixels(t.x0,t.y0,t.x1-t.x0,t.y1-t.y0,r.RGBA,r.FLOAT,0),r.bindBuffer(r.PIXEL_PACK_BUFFER,null);let i=r.fenceSync(r.SYNC_GPU_COMMANDS_COMPLETE,0);return r.flush(),i?{sync:i,rect:t,epoch:n}:null}build(){let e=this.gl,t={tex:[],fbo:[]};for(let t=0;t<16&&e.getError()!==e.NO_ERROR;t++);try{if(this.buildGL(t),e.getError()===e.OUT_OF_MEMORY)throw Error(`butter simulation: out of GPU memory`)}catch(n){for(let n of t.tex)e.deleteTexture(n);for(let n of t.fbo)e.deleteFramebuffer(n);throw this.renderer.resetState(),n}}buildGL(e){let t=this.gl,n=this.n;this.gpuBytes=0;let r=(n,r,i,a,o=null)=>{let s=t.createTexture();return e.tex.push(s),this.gpuBytes+=n*r*(i===t.RGBA32F?16:i===t.RGBA16F?8:4),t.bindTexture(t.TEXTURE_2D,s),t.texStorage2D(t.TEXTURE_2D,1,i,n,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),o&&t.texSubImage2D(t.TEXTURE_2D,0,0,0,n,r,t.RGBA,t.FLOAT,o),s},i=r=>{let i=t.createFramebuffer();e.fbo.push(i),t.bindFramebuffer(t.FRAMEBUFFER,i),r.forEach((e,n)=>t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+n,t.TEXTURE_2D,e,0)),t.drawBuffers(r.map((e,n)=>t.COLOR_ATTACHMENT0+n));let a=t.checkFramebufferStatus(t.FRAMEBUFFER);if(a!==t.FRAMEBUFFER_COMPLETE)throw Error(`butter simulation: framebuffer incomplete (${qd(t,a,r.length,n)})`);for(let e=0;e<r.length;e++)t.clearBufferfv(t.COLOR,e,[0,0,0,0]);return i},a=e=>{let n=(e,n)=>{let r=t.createShader(e);if(t.shaderSource(r,n),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))throw Error(`butter simulation shader: ${Jd(t.getShaderInfoLog(r))}`);return r},r=t.createProgram();if(t.attachShader(r,n(t.VERTEX_SHADER,yd)),t.attachShader(r,n(t.FRAGMENT_SHADER,e)),t.linkProgram(r),!t.getProgramParameter(r,t.LINK_STATUS))throw Error(`butter simulation program: ${Jd(t.getProgramInfoLog(r))}`);let i={},a=t.getProgramParameter(r,t.ACTIVE_UNIFORMS);for(let e=0;e<a;e++){let n=t.getActiveUniform(r,e).name.replace(/\[0\]$/,``);i[n]=t.getUniformLocation(r,n)}return{prog:r,u:i}};t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.activeTexture(t.TEXTURE0);let o=new Float32Array(n*n*4);for(let e=0;e<n*n;e++)o[e*4]=this.mask[e],o[e*4+1]=this.noise[e],o[e*4+2]=this.patch[e];let s=this.ridge.length,c=new Float32Array(s*4);for(let e=0;e<s;e++)c[e*4]=this.ridge[e],c[e*4+1]=this.comb[e];let l=[0,1].map(()=>[0,1,2,3].map(()=>r(n,n,t.RGBA32F,t.NEAREST))),u=[0,1].map(()=>r(1,1,t.RGBA32F,t.NEAREST)),d=r(n,1,t.RGBA32F,t.NEAREST),f=[0,1,2,3].map(e=>r(n,n,e===0?t.RGBA16F:t.RGBA8,t.LINEAR)),p={state:l,stateFbo:l.map(i),load:u,loadFbo:u.map(e=>i([e])),cols:d,colsFbo:i([d]),field:r(n,n,t.RGBA32F,t.NEAREST,o),ridge:r(s,1,t.RGBA32F,t.NEAREST,c),show:f,showFbo:i(f),vao:t.createVertexArray(),stamp:a(Cd),colsProg:a(wd),total:a(Td),apply:a(Ed),showProg:a(Dd),loadPbo:t.createBuffer(),heightPbo:t.createBuffer()};t.bindTexture(t.TEXTURE_2D,u[0]),t.texSubImage2D(t.TEXTURE_2D,0,0,0,1,1,t.RGBA,t.FLOAT,new Float32Array([this.capacity,0,0,0])),this.res=p;let m=this.p;t.useProgram(p.stamp.prog);let h=p.stamp.u;t.uniform1i(h.uField,Vd),t.uniform1i(h.uRidge,Hd),t.uniform1i(h.uN,n),t.uniform1i(h.uRidgeHalf,s-1>>1),t.uniform1f(h.uFilmMin,m.filmMin),t.uniform1f(h.uDepRate,m.depositRate),t.uniform1f(h.uHalfW,m.bladeWidth/2),t.uniform1f(h.uHalfL,m.bladeLength/2),t.uniform1f(h.uTapFeather,m.feather),t.uniform1i(h.uLevelStep,Math.max(1,Math.round(this.f))),t.useProgram(p.total.prog),t.uniform1i(p.total.u.uCols,Wd),t.useProgram(p.showProg.prog),t.uniform1f(p.showProg.u.uHeightMax,m.heightMax),t.useProgram(null),this.textures.height.sourceTexture=f[0],this.textures.mat.sourceTexture=f[1],this.textures.par.sourceTexture=f[2],this.textures.under.sourceTexture=f[3],this.textures.field.sourceTexture=this.res.field,this.renderer.resetState()}};async function Xd(){await new Promise(e=>setTimeout(e,500)),typeof document<`u`&&document.hidden&&await new Promise(e=>document.addEventListener(`visibilitychange`,e,{once:!0}))}async function Zd(e,t=Xd){try{return await e()}catch{return await t(),e()}}function Qd(e){let t=e?.name;return`${typeof t==`string`?t:`Error`}${typeof document>`u`?``:`, `+document.visibilityState}`}async function $d(e,t=new Image){try{await Zd(()=>(t.src=e,t.decode()))}catch(t){throw Error(`failed to load ${e} (${Qd(t)})`)}return t}async function ef(e){try{let t=await Zd(async()=>{await new Promise((t,n)=>{let r=new Image;r.onload=t,r.onerror=n,r.src=e});let t=await fetch(e);if(!t.ok)throw Error(String(t.status));return t.blob()});return await $d(URL.createObjectURL(t))}catch{throw Error(`failed to load `+e)}}async function tf(e){let t;try{t=await Zd(()=>fetch(e))}catch(t){throw Error(`failed to load ${e} (${Qd(t)})`)}if(!t.ok)throw Error(`${e} not found`);return await t.json()}function nf(e){e.width=0,e.height=0}function rf(e,t,n){let r=document.createElement(`canvas`);r.width=t,r.height=n;try{let i=r.getContext(`2d`,{willReadFrequently:!0});if(!i)throw Error(`2d context unavailable`);return i.drawImage(e,0,0,t,n),i.getImageData(0,0,t,n).data}finally{nf(r)}}var af={name:`Stullensimulator`,editorDescription:`Schmier eine Scheibe Brot, leg was drauf und mach ein Foto. Es bekommt eine Nummer und einen Link.`,indexDescription:`Alle Stullen, die im Stullensimulator geschmiert wurden.`,aboutDescription:`Brot schmieren im Browser: über 20 Beläge, echte Schwerkraft, realistisches Gurkenverhalten. Von Gregor Weichbrodt.`,image:{path:`/og.jpg`,...D,alt:`A slice of rye bread with butter, ham, egg and gherkin on a wooden board`}},of=`Sorry, this device can't spread butter. Another browser might.`,sf=`Part of the page didn't load.`,cf=`This browser can't draw the sandwich right now.`,lf=`Der ${af.name} ist nicht gestartet.`,uf=[[/^failed to load |Failed to fetch|Load failed|NetworkError|module script|imported module/i,sf],[/^butter simulation/,of],[/WebGL|getShaderPrecisionFormat/,cf]];function df(e){let t=``;try{t=String(e?.message??e)}catch{}return t===`Sorry, this device can't spread butter. Another browser might.`?t:uf.find(([e])=>e.test(t))?.[1]??lf}var ff=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},pf=new os(-1,1,1,-1,0,1),mf=new class extends si{constructor(){super(),this.setAttribute(`position`,new Yr([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new Yr([0,2,0,0,2,0],2))}},hf=class{constructor(e){this._mesh=new ji(mf,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,pf)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},gf={name:`GTAOShader`,defines:{PERSPECTIVE_CAMERA:1,SAMPLES:16,NORMAL_VECTOR_TYPE:1,DEPTH_SWIZZLING:`x`,SCREEN_SPACE_RADIUS:0,SCREEN_SPACE_RADIUS_SCALE:100,SCENE_CLIP_BOX:0},uniforms:{tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new X},cameraNear:{value:null},cameraFar:{value:null},cameraProjectionMatrix:{value:new An},cameraProjectionMatrixInverse:{value:new An},cameraWorldMatrix:{value:new An},radius:{value:.25},distanceExponent:{value:1},thickness:{value:1},distanceFallOff:{value:1},scale:{value:1},sceneBoxMin:{value:new Z(-1,-1,-1)},sceneBoxMax:{value:new Z(1,1,1)}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		varying vec2 vUv;
		uniform highp sampler2D tNormal;
		uniform highp sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform mat4 cameraWorldMatrix;
		uniform float radius;
		uniform float distanceExponent;
		uniform float thickness;
		uniform float distanceFallOff;
		uniform float scale;
		#if SCENE_CLIP_BOX == 1
			uniform vec3 sceneBoxMin;
			uniform vec3 sceneBoxMax;
		#endif

		#include <common>
		#include <packing>

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)
		#endif

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;
		}

		float fetchDepth(const ivec2 uv) {
			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;
		}

		float getViewZ(const in float depth) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
			#else
				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
			#if NORMAL_VECTOR_TYPE == 2
				return normalize(textureLod(tNormal, uv, 0.).rgb);
			#elif NORMAL_VECTOR_TYPE == 1
				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
			#else
				return computeNormalFromDepth(uv);
			#endif
		}

		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {
			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);
			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;
			float sampleSceneDepth = getDepth(sampleUv);
			return vec3(sampleUv, sampleSceneDepth);
		}

		void main() {
			float depth = getDepth(vUv.xy);

			#ifdef USE_REVERSED_DEPTH_BUFFER
				if (depth <= 0.0) {
					discard;
					return;
				}
			#else
				if (depth >= 1.0) {
					discard;
					return;
				}
			#endif
			
			vec3 viewPos = getViewPosition(vUv, depth);
			vec3 viewNormal = getViewNormal(vUv);

			float radiusToUse = radius;
			float distanceFalloffToUse = thickness;
			#if SCREEN_SPACE_RADIUS == 1
				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;
				radiusToUse *= radiusScale;
				distanceFalloffToUse *= radiusScale;
			#endif

			#if SCENE_CLIP_BOX == 1
				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;
				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));
				if (boxDistance > radiusToUse) {
					discard;
					return;
				}
			#endif

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;
			vec3 tangent = normalize(vec3(randomVec.xy, 0.));
			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);
			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));

			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;
			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;
			float ao = 0.0;
			for (int i = 0; i < DIRECTIONS; ++i) {

				float angle = float(i) / float(DIRECTIONS) * PI;
				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);
				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);

				vec3 viewDir = normalize(-viewPos.xyz);
				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));
				vec3 sliceTangent = cross(sliceBitangent, viewDir);
				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));

				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);
				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));

				for (int j = 0; j < STEPS; ++j) {
					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);

					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);
					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					vec3 viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));
					}

					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);
					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);
					viewDelta = sampleSceneViewPos - viewPos;
					if (abs(viewDelta.z) < thickness) {
						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));
						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));
					}
				}

				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);
				float nx = dot(normalInSlice, sliceTangent);
				float ny = dot(normalInSlice, viewDir);
				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);
				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);
				float occlusion = nx * nxb + ny * nyb;
				ao += occlusion;
			}

			ao = clamp(ao / float(DIRECTIONS), 0., 1.);
		#if SCENE_CLIP_BOX == 1
			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));
		#endif
			ao = pow(ao, scale);

			gl_FragColor = FRAGMENT_OUTPUT;
		}`},_f={name:`GTAODepthShader`,defines:{PERSPECTIVE_CAMERA:1},uniforms:{tDepth:{value:null},cameraNear:{value:null},cameraFar:{value:null}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform sampler2D tDepth;
		uniform float cameraNear;
		uniform float cameraFar;
		varying vec2 vUv;

		#include <packing>

		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}

		void main() {
			float depth = getLinearDepth( vUv );
			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );

		}`},vf={name:`GTAOBlendShader`,uniforms:{tDiffuse:{value:null},intensity:{value:1}},vertexShader:`
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`
		uniform float intensity;
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);
		}`};function yf(e=5){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=bf(t),r=n.length,i=new Uint8Array(r*4);for(let e=0;e<r;++e){let t=n[e],a=2*Math.PI*t/r,o=new Z(Math.cos(a),Math.sin(a),0).normalize();i[e*4]=(o.x*.5+.5)*255,i[e*4+1]=(o.y*.5+.5)*255,i[e*4+2]=127,i[e*4+3]=255}let a=new Pi(i,t,t);return a.wrapS=L,a.wrapT=L,a.needsUpdate=!0,a}function bf(e){let t=Math.floor(e)%2==0?Math.floor(e)+1:Math.floor(e),n=t*t,r=Array(n).fill(0),i=Math.floor(t/2),a=t-1;for(let e=1;e<=n;)i===-1&&a===t?(a=t-2,i=0):(a===t&&(a=0),i<0&&(i=t-1)),r[i*t+a]===0?(r[i*t+a]=e++,a++,i--):(a-=2,i++);return r}var xf={name:`PoissonDenoiseShader`,defines:{SAMPLES:16,SAMPLE_VECTORS:Sf(16,2,1),NORMAL_VECTOR_TYPE:1,DEPTH_VALUE_SOURCE:0},uniforms:{tDiffuse:{value:null},tNormal:{value:null},tDepth:{value:null},tNoise:{value:null},resolution:{value:new X},cameraProjectionMatrixInverse:{value:new An},lumaPhi:{value:5},depthPhi:{value:5},normalPhi:{value:5},radius:{value:4},index:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,fragmentShader:`

		varying vec2 vUv;

		uniform sampler2D tDiffuse;
		uniform sampler2D tNormal;
		uniform sampler2D tDepth;
		uniform sampler2D tNoise;
		uniform vec2 resolution;
		uniform mat4 cameraProjectionMatrixInverse;
		uniform float lumaPhi;
		uniform float depthPhi;
		uniform float normalPhi;
		uniform float radius;
		uniform int index;

		#include <common>
		#include <packing>

		#ifndef SAMPLE_LUMINANCE
		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)
		#endif

		#ifndef FRAGMENT_OUTPUT
		#define FRAGMENT_OUTPUT vec4(denoised, 1.)
		#endif

		float getLuminance(const in vec3 a) {
			return SAMPLE_LUMINANCE;
		}

		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;

		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );
			#else
				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );
			#endif
			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;
			return viewSpacePosition.xyz / viewSpacePosition.w;
		}

		float getDepth(const vec2 uv) {
		#if DEPTH_VALUE_SOURCE == 1
			return textureLod(tDepth, uv.xy, 0.0).a;
		#else
			return textureLod(tDepth, uv.xy, 0.0).r;
		#endif
		}

		float fetchDepth(const ivec2 uv) {
			#if DEPTH_VALUE_SOURCE == 1
				return texelFetch(tDepth, uv.xy, 0).a;
			#else
				return texelFetch(tDepth, uv.xy, 0).r;
			#endif
		}

		vec3 computeNormalFromDepth(const vec2 uv) {
			vec2 size = vec2(textureSize(tDepth, 0));
			ivec2 p = ivec2(uv * size);
			float c0 = fetchDepth(p);
			float l2 = fetchDepth(p - ivec2(2, 0));
			float l1 = fetchDepth(p - ivec2(1, 0));
			float r1 = fetchDepth(p + ivec2(1, 0));
			float r2 = fetchDepth(p + ivec2(2, 0));
			float b2 = fetchDepth(p - ivec2(0, 2));
			float b1 = fetchDepth(p - ivec2(0, 1));
			float t1 = fetchDepth(p + ivec2(0, 1));
			float t2 = fetchDepth(p + ivec2(0, 2));
			float dl = abs((2.0 * l1 - l2) - c0);
			float dr = abs((2.0 * r1 - r2) - c0);
			float db = abs((2.0 * b1 - b2) - c0);
			float dt = abs((2.0 * t1 - t2) - c0);
			vec3 ce = getViewPosition(uv, c0).xyz;
			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz
									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;
			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz
									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;
			return normalize(cross(dpdx, dpdy));
		}

		vec3 getViewNormal(const vec2 uv) {
		#if NORMAL_VECTOR_TYPE == 2
			return normalize(textureLod(tNormal, uv, 0.).rgb);
		#elif NORMAL_VECTOR_TYPE == 1
			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);
		#else
			return computeNormalFromDepth(uv);
		#endif
		}

		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {
			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);
			float sampleDepth = getDepth(sampleUv);
			vec3 sampleNormal = getViewNormal(sampleUv);
			vec3 neighborColor = sampleTexel.rgb;
			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);

			float normalDiff = dot(viewNormal, sampleNormal);
			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);
			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));
			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);
			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));
			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);
			float w = lumaSimilarity * depthSimilarity * normalSimilarity;

			denoised += w * neighborColor;
			totalWeight += w;
		}

		void main() {
			float depth = getDepth(vUv.xy);
			vec3 viewNormal = getViewNormal(vUv);
			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {
				discard;
				return;
			}
			vec4 texel = textureLod(tDiffuse, vUv, 0.0);
			vec3 center = texel.rgb;
			vec3 viewPos = getViewPosition(vUv, depth);

			vec2 noiseResolution = vec2(textureSize(tNoise, 0));
			vec2 noiseUv = vUv * resolution / noiseResolution;
			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);
      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));
    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);

			float totalWeight = 1.0;
			vec3 denoised = texel.rgb;
			for (int i = 0; i < SAMPLES; i++) {
				vec3 sampleDir = poissonDisk[i];
				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);
				vec2 sampleUv = vUv + offset;
				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);
			}

			if (totalWeight > 0.) {
				denoised /= totalWeight;
			}
			gl_FragColor = FRAGMENT_OUTPUT;
		}`};function Sf(e,t,n){let r=Cf(e,t,n),i=`vec3[SAMPLES](`;for(let t=0;t<e;t++){let n=r[t];i+=`vec3(${n.x}, ${n.y}, ${n.z})${t<e-1?`,`:`)`}`}return i}function Cf(e,t,n){let r=[];for(let i=0;i<e;i++){let a=2*Math.PI*t*i/e,o=(i/(e-1))**n;r.push(new Z(Math.cos(a),Math.sin(a),o))}return r}var wf={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},Tf=class{constructor(e=Math){this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.grad4=[[0,1,1,1],[0,1,1,-1],[0,1,-1,1],[0,1,-1,-1],[0,-1,1,1],[0,-1,1,-1],[0,-1,-1,1],[0,-1,-1,-1],[1,0,1,1],[1,0,1,-1],[1,0,-1,1],[1,0,-1,-1],[-1,0,1,1],[-1,0,1,-1],[-1,0,-1,1],[-1,0,-1,-1],[1,1,0,1],[1,1,0,-1],[1,-1,0,1],[1,-1,0,-1],[-1,1,0,1],[-1,1,0,-1],[-1,-1,0,1],[-1,-1,0,-1],[1,1,1,0],[1,1,-1,0],[1,-1,1,0],[1,-1,-1,0],[-1,1,1,0],[-1,1,-1,0],[-1,-1,1,0],[-1,-1,-1,0]],this.p=[];for(let t=0;t<256;t++)this.p[t]=Math.floor(e.random()*256);this.perm=[];for(let e=0;e<512;e++)this.perm[e]=this.p[e&255];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]}noise(e,t){let n,r,i,a=.5*(Math.sqrt(3)-1),o=(e+t)*a,s=Math.floor(e+o),c=Math.floor(t+o),l=(3-Math.sqrt(3))/6,u=(s+c)*l,d=s-u,f=c-u,p=e-d,m=t-f,h,g;p>m?(h=1,g=0):(h=0,g=1);let _=p-h+l,v=m-g+l,y=p-1+2*l,b=m-1+2*l,x=s&255,S=c&255,C=this.perm[x+this.perm[S]]%12,w=this.perm[x+h+this.perm[S+g]]%12,T=this.perm[x+1+this.perm[S+1]]%12,E=.5-p*p-m*m;E<0?n=0:(E*=E,n=E*E*this._dot(this.grad3[C],p,m));let D=.5-_*_-v*v;D<0?r=0:(D*=D,r=D*D*this._dot(this.grad3[w],_,v));let O=.5-y*y-b*b;return O<0?i=0:(O*=O,i=O*O*this._dot(this.grad3[T],y,b)),70*(n+r+i)}noise3d(e,t,n){let r,i,a,o,s=(e+t+n)*(1/3),c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=1/6,f=(c+l+u)*d,p=c-f,m=l-f,h=u-f,g=e-p,_=t-m,v=n-h,y,b,x,S,C,w;g>=_?_>=v?(y=1,b=0,x=0,S=1,C=1,w=0):g>=v?(y=1,b=0,x=0,S=1,C=0,w=1):(y=0,b=0,x=1,S=1,C=0,w=1):_<v?(y=0,b=0,x=1,S=0,C=1,w=1):g<v?(y=0,b=1,x=0,S=0,C=1,w=1):(y=0,b=1,x=0,S=1,C=1,w=0);let T=g-y+d,E=_-b+d,D=v-x+d,O=g-S+2*d,k=_-C+2*d,A=v-w+2*d,j=g-1+3*d,M=_-1+3*d,N=v-1+3*d,P=c&255,F=l&255,I=u&255,ee=this.perm[P+this.perm[F+this.perm[I]]]%12,te=this.perm[P+y+this.perm[F+b+this.perm[I+x]]]%12,L=this.perm[P+S+this.perm[F+C+this.perm[I+w]]]%12,R=this.perm[P+1+this.perm[F+1+this.perm[I+1]]]%12,z=.6-g*g-_*_-v*v;z<0?r=0:(z*=z,r=z*z*this._dot3(this.grad3[ee],g,_,v));let B=.6-T*T-E*E-D*D;B<0?i=0:(B*=B,i=B*B*this._dot3(this.grad3[te],T,E,D));let ne=.6-O*O-k*k-A*A;ne<0?a=0:(ne*=ne,a=ne*ne*this._dot3(this.grad3[L],O,k,A));let V=.6-j*j-M*M-N*N;return V<0?o=0:(V*=V,o=V*V*this._dot3(this.grad3[R],j,M,N)),32*(r+i+a+o)}noise4d(e,t,n,r){let i=this.grad4,a=this.simplex,o=this.perm,s=(Math.sqrt(5)-1)/4,c=(5-Math.sqrt(5))/20,l,u,d,f,p,m=(e+t+n+r)*s,h=Math.floor(e+m),g=Math.floor(t+m),_=Math.floor(n+m),v=Math.floor(r+m),y=(h+g+_+v)*c,b=h-y,x=g-y,S=_-y,C=v-y,w=e-b,T=t-x,E=n-S,D=r-C,O=w>T?32:0,k=w>E?16:0,A=T>E?8:0,j=w>D?4:0,M=T>D?2:0,N=+(E>D),P=O+k+A+j+M+N,F=+(a[P][0]>=3),I=+(a[P][1]>=3),ee=+(a[P][2]>=3),te=+(a[P][3]>=3),L=+(a[P][0]>=2),R=+(a[P][1]>=2),z=+(a[P][2]>=2),B=+(a[P][3]>=2),ne=+(a[P][0]>=1),V=+(a[P][1]>=1),H=+(a[P][2]>=1),re=+(a[P][3]>=1),ie=w-F+c,ae=T-I+c,oe=E-ee+c,se=D-te+c,ce=w-L+2*c,le=T-R+2*c,U=E-z+2*c,ue=D-B+2*c,de=w-ne+3*c,fe=T-V+3*c,W=E-H+3*c,pe=D-re+3*c,me=w-1+4*c,he=T-1+4*c,ge=E-1+4*c,_e=D-1+4*c,ve=h&255,ye=g&255,be=_&255,G=v&255,xe=o[ve+o[ye+o[be+o[G]]]]%32,Se=o[ve+F+o[ye+I+o[be+ee+o[G+te]]]]%32,Ce=o[ve+L+o[ye+R+o[be+z+o[G+B]]]]%32,we=o[ve+ne+o[ye+V+o[be+H+o[G+re]]]]%32,Te=o[ve+1+o[ye+1+o[be+1+o[G+1]]]]%32,Ee=.6-w*w-T*T-E*E-D*D;Ee<0?l=0:(Ee*=Ee,l=Ee*Ee*this._dot4(i[xe],w,T,E,D));let K=.6-ie*ie-ae*ae-oe*oe-se*se;K<0?u=0:(K*=K,u=K*K*this._dot4(i[Se],ie,ae,oe,se));let De=.6-ce*ce-le*le-U*U-ue*ue;De<0?d=0:(De*=De,d=De*De*this._dot4(i[Ce],ce,le,U,ue));let q=.6-de*de-fe*fe-W*W-pe*pe;q<0?f=0:(q*=q,f=q*q*this._dot4(i[we],de,fe,W,pe));let Oe=.6-me*me-he*he-ge*ge-_e*_e;return Oe<0?p=0:(Oe*=Oe,p=Oe*Oe*this._dot4(i[Te],me,he,ge,_e)),27*(l+u+d+f+p)}_dot(e,t,n){return e[0]*t+e[1]*n}_dot3(e,t,n,r){return e[0]*t+e[1]*n+e[2]*r}_dot4(e,t,n,r,i){return e[0]*t+e[1]*n+e[2]*r+e[3]*i}},Ef=class e extends ff{constructor(e,t,n=512,r=512,i,a,o){super(),this.width=n,this.height=r,this.clear=!0,this.camera=t,this.scene=e,this.output=0,this._renderGBuffer=!0,this._visibilityCache=[],this.blendIntensity=1,this.pdRings=2,this.pdRadiusExponent=2,this.pdSamples=16,this.gtaoNoiseTexture=yf(),this.pdNoiseTexture=this._generateNoise(),this.gtaoRenderTarget=new Dn(this.width,this.height,{type:de,depthBuffer:!1}),this.pdRenderTarget=this.gtaoRenderTarget.clone(),this.gtaoMaterial=new xo({defines:Object.assign({},gf.defines),uniforms:vo.clone(gf.uniforms),vertexShader:gf.vertexShader,fragmentShader:gf.fragmentShader,blending:0,depthTest:!1,depthWrite:!1}),this.gtaoMaterial.defines.PERSPECTIVE_CAMERA=+!!this.camera.isPerspectiveCamera,this.gtaoMaterial.uniforms.tNoise.value=this.gtaoNoiseTexture,this.gtaoMaterial.uniforms.resolution.value.set(this.width,this.height),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.normalMaterial=new Co,this.normalMaterial.blending=0,this.pdMaterial=new xo({defines:Object.assign({},xf.defines),uniforms:vo.clone(xf.uniforms),vertexShader:xf.vertexShader,fragmentShader:xf.fragmentShader,depthTest:!1,depthWrite:!1}),this.pdMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.pdMaterial.uniforms.tNoise.value=this.pdNoiseTexture,this.pdMaterial.uniforms.resolution.value.set(this.width,this.height),this.pdMaterial.uniforms.lumaPhi.value=10,this.pdMaterial.uniforms.depthPhi.value=2,this.pdMaterial.uniforms.normalPhi.value=3,this.pdMaterial.uniforms.radius.value=8,this.depthRenderMaterial=new xo({defines:Object.assign({},_f.defines),uniforms:vo.clone(_f.uniforms),vertexShader:_f.vertexShader,fragmentShader:_f.fragmentShader,blending:0}),this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this.copyMaterial=new xo({uniforms:vo.clone(wf.uniforms),vertexShader:wf.vertexShader,fragmentShader:wf.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this.blendMaterial=new xo({uniforms:vo.clone(vf.uniforms),vertexShader:vf.vertexShader,fragmentShader:vf.fragmentShader,transparent:!0,depthTest:!1,depthWrite:!1,blending:5,blendSrc:208,blendDst:200,blendEquation:100,blendSrcAlpha:206,blendDstAlpha:200,blendEquationAlpha:100}),this._fsQuad=new hf(null),this._originalClearColor=new dr,this.setGBuffer(i?i.depthTexture:void 0,i?i.normalTexture:void 0),a!==void 0&&this.updateGtaoMaterial(a),o!==void 0&&this.updatePdMaterial(o)}setSize(e,t){this.width=e,this.height=t,this.gtaoRenderTarget.setSize(e,t),this.normalRenderTarget.setSize(e,t),this.pdRenderTarget.setSize(e,t),this.gtaoMaterial.uniforms.resolution.value.set(e,t),this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.pdMaterial.uniforms.resolution.value.set(e,t),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse)}dispose(){this.gtaoNoiseTexture.dispose(),this.pdNoiseTexture.dispose(),this.normalRenderTarget.dispose(),this.gtaoRenderTarget.dispose(),this.pdRenderTarget.dispose(),this.normalMaterial.dispose(),this.pdMaterial.dispose(),this.copyMaterial.dispose(),this.depthRenderMaterial.dispose(),this._fsQuad.dispose()}get gtaoMap(){return this.pdRenderTarget.texture}setGBuffer(e,t){e===void 0?(this.depthTexture=new Vi,this.depthTexture.format=be,this.depthTexture.type=pe,this.normalRenderTarget=new Dn(this.width,this.height,{minFilter:B,magFilter:B,type:de,depthTexture:this.depthTexture}),this.normalTexture=this.normalRenderTarget.texture,this._renderGBuffer=!0):(this.depthTexture=e,this.normalTexture=t,this._renderGBuffer=!1);let n=+!!this.normalTexture,r=this.depthTexture===this.normalTexture?`w`:`x`;this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE=n,this.gtaoMaterial.defines.DEPTH_SWIZZLING=r,this.gtaoMaterial.uniforms.tNormal.value=this.normalTexture,this.gtaoMaterial.uniforms.tDepth.value=this.depthTexture,this.pdMaterial.defines.NORMAL_VECTOR_TYPE=n,this.pdMaterial.defines.DEPTH_SWIZZLING=r,this.pdMaterial.uniforms.tNormal.value=this.normalTexture,this.pdMaterial.uniforms.tDepth.value=this.depthTexture,this.depthRenderMaterial.uniforms.tDepth.value=this.normalRenderTarget.depthTexture}setSceneClipBox(e){e?(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX!==1,this.gtaoMaterial.defines.SCENE_CLIP_BOX=1,this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min),this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)):(this.gtaoMaterial.needsUpdate=this.gtaoMaterial.defines.SCENE_CLIP_BOX===0,this.gtaoMaterial.defines.SCENE_CLIP_BOX=0)}updateGtaoMaterial(e){e.radius!==void 0&&(this.gtaoMaterial.uniforms.radius.value=e.radius),e.distanceExponent!==void 0&&(this.gtaoMaterial.uniforms.distanceExponent.value=e.distanceExponent),e.thickness!==void 0&&(this.gtaoMaterial.uniforms.thickness.value=e.thickness),e.distanceFallOff!==void 0&&(this.gtaoMaterial.uniforms.distanceFallOff.value=e.distanceFallOff,this.gtaoMaterial.needsUpdate=!0),e.scale!==void 0&&(this.gtaoMaterial.uniforms.scale.value=e.scale),e.samples!==void 0&&e.samples!==this.gtaoMaterial.defines.SAMPLES&&(this.gtaoMaterial.defines.SAMPLES=e.samples,this.gtaoMaterial.needsUpdate=!0),e.screenSpaceRadius!==void 0&&+!!e.screenSpaceRadius!==this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS&&(this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS=+!!e.screenSpaceRadius,this.gtaoMaterial.needsUpdate=!0)}updatePdMaterial(e){let t=!1;e.lumaPhi!==void 0&&(this.pdMaterial.uniforms.lumaPhi.value=e.lumaPhi),e.depthPhi!==void 0&&(this.pdMaterial.uniforms.depthPhi.value=e.depthPhi),e.normalPhi!==void 0&&(this.pdMaterial.uniforms.normalPhi.value=e.normalPhi),e.radius!==void 0&&e.radius!==this.radius&&(this.pdMaterial.uniforms.radius.value=e.radius),e.radiusExponent!==void 0&&e.radiusExponent!==this.pdRadiusExponent&&(this.pdRadiusExponent=e.radiusExponent,t=!0),e.rings!==void 0&&e.rings!==this.pdRings&&(this.pdRings=e.rings,t=!0),e.samples!==void 0&&e.samples!==this.pdSamples&&(this.pdSamples=e.samples,t=!0),t&&(this.pdMaterial.defines.SAMPLES=this.pdSamples,this.pdMaterial.defines.SAMPLE_VECTORS=Sf(this.pdSamples,this.pdRings,this.pdRadiusExponent),this.pdMaterial.needsUpdate=!0)}render(t,n,r){switch(this._renderGBuffer&&(this._overrideVisibility(),this._renderOverride(t,this.normalMaterial,this.normalRenderTarget,7829503,1),this._restoreVisibility()),this.gtaoMaterial.uniforms.cameraNear.value=this.camera.near,this.gtaoMaterial.uniforms.cameraFar.value=this.camera.far,this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix),this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld),this._renderPass(t,this.gtaoMaterial,this.gtaoRenderTarget,16777215,1),this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse),this._renderPass(t,this.pdMaterial,this.pdRenderTarget,16777215,1),this.output){case e.OUTPUT.Off:break;case e.OUTPUT.Diffuse:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.AO:this.copyMaterial.uniforms.tDiffuse.value=this.gtaoRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Denoise:this.copyMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Depth:this.depthRenderMaterial.uniforms.cameraNear.value=this.camera.near,this.depthRenderMaterial.uniforms.cameraFar.value=this.camera.far,this._renderPass(t,this.depthRenderMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Normal:this.copyMaterial.uniforms.tDiffuse.value=this.normalRenderTarget.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n);break;case e.OUTPUT.Default:this.copyMaterial.uniforms.tDiffuse.value=r.texture,this.copyMaterial.blending=0,this._renderPass(t,this.copyMaterial,this.renderToScreen?null:n),this.blendMaterial.uniforms.intensity.value=this.blendIntensity,this.blendMaterial.uniforms.tDiffuse.value=this.pdRenderTarget.texture,this._renderPass(t,this.blendMaterial,this.renderToScreen?null:n);break;default:console.warn(`THREE.GTAOPass: Unknown output type.`)}}_renderPass(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this._fsQuad.material=t,this._fsQuad.render(e),e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_renderOverride(e,t,n,r,i){e.getClearColor(this._originalClearColor);let a=e.getClearAlpha(),o=e.autoClear;e.setRenderTarget(n),e.autoClear=!1,r=t.clearColor||r,i=t.clearAlpha||i,r!=null&&(e.setClearColor(r),e.setClearAlpha(i||0),e.clear()),this.scene.overrideMaterial=t,e.render(this.scene,this.camera),this.scene.overrideMaterial=null,e.autoClear=o,e.setClearColor(this._originalClearColor),e.setClearAlpha(a)}_overrideVisibility(){let e=this.scene,t=this._visibilityCache;e.traverse(function(e){(e.isPoints||e.isLine||e.isLine2)&&e.visible&&(e.visible=!1,t.push(e))})}_restoreVisibility(){let e=this._visibilityCache;for(let t=0;t<e.length;t++)e[t].visible=!0;e.length=0}_generateNoise(e=64){let t=new Tf,n=e*e*4,r=new Uint8Array(n);for(let n=0;n<e;n++)for(let i=0;i<e;i++){let a=n,o=i;r[(n*e+i)*4]=(t.noise(a,o)*.5+.5)*255,r[(n*e+i)*4+1]=(t.noise(a+e,o)*.5+.5)*255,r[(n*e+i)*4+2]=(t.noise(a,o+e)*.5+.5)*255,r[(n*e+i)*4+3]=(t.noise(a+e,o+e)*.5+.5)*255}let i=new Pi(r,e,e,ve,ae);return i.wrapS=L,i.wrapT=L,i.needsUpdate=!0,i}};Ef.OUTPUT={Off:-1,Default:0,Diffuse:1,Depth:2,Normal:3,AO:4,Denoise:5};var Df={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},Of=class extends ff{constructor(){super(),this.isOutputPass=!0,this.uniforms=vo.clone(Df.uniforms),this.material=new So({name:Df.name,uniforms:this.uniforms,vertexShader:Df.vertexShader,fragmentShader:Df.fragmentShader}),this._fsQuad=new hf(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},mn.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},kf=`uniform sampler2D uBread;
uniform sampler2D uHeight;
uniform sampler2D uMask;      // 1 on the slice, 0 on the board
uniform sampler2D uMat;       // spread colour (rgb) + gloss (a)
uniform sampler2D uPar;       // translucency (r), grain (g), pore filling (b), fruit pieces (a)
uniform sampler2D uUnder;     // what lies under the top layer: colour (rgb), how much it covers the bread (a)
uniform vec2 uTexel;      // 1 / height grid size
uniform vec2 uBreadTexel; // step for the crumb relief's slope
uniform float uGridScale; // height grid size / the size the shading was tuned on (512)
uniform float uHeightMax; // height encoded as 1.0 in the texture
uniform float uBump;      // normal strength
uniform vec3 uShadeTint;  // colour of the spread's own relief shade (the look, stage.ts)
uniform vec3 uSpecTint;   // colour and strength of its gloss highlight
uniform vec3 uSunTint;    // the light's white balance (the look); on the crumb only
uniform vec2 uPoreRange;  // luma read as pore .. as raised crumb (poreRange, stage.ts)

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// how deep the crumb's pore at uv is, from the photo's brightness:
// bright = raised crumb, dark = pore, relative to the bread's own crumb
float poreDepth(vec2 uv) {
  float lum = dot(texture(uBread, uv).rgb, vec3(0.299, 0.587, 0.114));
  return 1.0 - smoothstep(uPoreRange.x, uPoreRange.y, lum);
}

// smooth value noise 0..1, for blobs (fruit pieces)
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

vec4 shadeSlice(vec2 uv) {
  // the white balance warms the bread, not the spreads: their colours are
  // set after the reference photos (warmed, butter turned beige); a
  // translucent spread still shows the warmed crumb through it
  vec3 bread = texture(uBread, uv).rgb * uSunTint;
  float hc = texture(uHeight, uv).r;
  float hl = texture(uHeight, uv - vec2(uTexel.x, 0.0)).r;
  float hr = texture(uHeight, uv + vec2(uTexel.x, 0.0)).r;
  float hu = texture(uHeight, uv - vec2(0.0, uTexel.y)).r;
  float hd = texture(uHeight, uv + vec2(0.0, uTexel.y)).r;
  float h = hc * uHeightMax;

  vec4 mat = texture(uMat, uv);
  vec3 sc = mat.rgb;
  float gloss = mat.a;
  vec4 par = texture(uPar, uv);
  float trans = par.r;
  float grain = par.g;
  float pore = par.b;
  float chunk = par.a;
  // fruit pieces in a jam: darker, more opaque bits that also bump the
  // surface and break up the highlight (a plain red gel looked like wax)
  vec2 cp = uv * 38.0;
  float cn = vnoise(cp) * 0.65 + vnoise(cp * 2.7 + 3.1) * 0.35;
  float piece = smoothstep(0.54, 0.78, cn) * chunk;
  sc = mix(sc, sc * vec3(0.72, 0.62, 0.62), piece);
  trans = mix(trans, trans * 0.45, piece);
  gloss = mix(gloss, gloss * 0.7, piece);
  vec2 cgrad = vec2(vnoise(cp + vec2(0.07, 0.0)) - vnoise(cp - vec2(0.07, 0.0)), vnoise(cp + vec2(0.0, 0.07)) - vnoise(cp - vec2(0.0, 0.07))) * chunk;
  vec4 und = texture(uUnder, uv);
  // the ground a translucent top layer shows: the crumb, or the spread below
  vec3 ground = mix(bread, und.rgb, und.a);

  // the photo's brightness stands in for the crumb relief (sampled around
  // the texel for the slope of the pores); a spread below fills the pores
  float poreAmp = 0.14 * (1.0 - und.a);
  float depth = poreAmp * poreDepth(uv);
  float depthL = poreAmp * poreDepth(uv - vec2(uBreadTexel.x, 0.0));
  float depthR = poreAmp * poreDepth(uv + vec2(uBreadTexel.x, 0.0));
  float depthU = poreAmp * poreDepth(uv - vec2(0.0, uBreadTexel.y));
  float depthD = poreAmp * poreDepth(uv + vec2(0.0, uBreadTexel.y));
  // The spread drapes over the crumb (reference photos in docs/referenzen-butter.md):
  // a thin film follows every pore, a thick layer levels out. sag is how far
  // the surface dips into a pore, as a fraction of the pore's depth: 1 = the
  // film follows the crumb, 0 = flat. It falls with the layer's thickness and
  // runny spreads (pore 1) start lower than stiff ones. So a pore holds
  // depth*(1-sag) more than a ridge: thin = crumb through a haze with its
  // dimples, medium = pores filled but still dimples, thick = smooth.
  float layer = smoothstep(0.0, 0.04, h);
  float sag = (1.4 - 0.8 * pore) * exp(-h / 0.09) * layer;
  float hEff = max(0.0, h + depth * (1.0 - sag) * layer);

  // surface normal from the height gradient (uv y points down) plus the
  // dimples the surface keeps over the pores; grainy spreads get a fine
  // random roughness on top
  vec2 grad = vec2(hr - hl, hd - hu) * uHeightMax * uBump * uGridScale;
  grad -= vec2(depthR - depthL, depthD - depthU) * sag * uBump * 0.35;
  vec2 gcell = floor(uv * 700.0);
  vec2 gn = vec2(hash(gcell), hash(gcell + 17.3)) - 0.5;
  vec3 n = normalize(vec3(-grad.x + gn.x * grain * 0.9 - cgrad.x * 1.8, -grad.y + gn.y * grain * 0.9 - cgrad.y * 1.8, 1.0));

  // light from the top-left, viewer straight above; the same direction as the
  // scene's light (stage.ts LIGHT_SIDE) at a height of its own (about 43°): the gloss
  // was tuned on this, the scene's light makes every spread wet and bright
  vec3 L = normalize(vec3(-0.55, -0.6, 0.75));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = max(dot(n, L), 0.0);
  float spec = pow(max(dot(n, H), 0.0), mix(22.0, 90.0, gloss));

  float haze = 1.0 - exp(-hEff * 24.0);
  float cover = 1.0 - exp(-hEff * 14.0);
  // translucent spreads tint the crumb instead of covering it: the thin
  // haze and the body itself show the crumb through the spread's colour
  // the factor 2.4 suits the dark crumb; on a pale ground (butter below) it
  // would clip to neon, so it eases off with the ground's brightness, and a
  // pale ground scatters some of its own light back through the layer
  float gLum = dot(ground, vec3(0.299, 0.587, 0.114));
  float tk = 2.4 * pow(0.45 / max(gLum, 0.45), 0.7);
  vec3 tinted = clamp(ground * sc * tk, 0.0, 1.0);
  tinted = mix(tinted, mix(tinted, ground, 0.1), und.a);
  vec3 hazeCol = mix(mix(vec3(0.98, 0.96, 0.88), sc, 0.6), tinted, trans);
  // (a dark opaque spread's haze on a pale ground read as a blurred rim: weaker)
  vec3 hazed = mix(ground, hazeCol, mix(0.26, 0.6, trans) * haze);
  vec3 body = mix(sc, tinted, trans * (1.0 - 0.6 * cover));
  vec3 col = mix(hazed, body, cover);

  // soft relief, waxy sheen rather than hard highlights
  // the shade away from the light takes the warm light bounced off the
  // board and the bread instead of going grey; only where the relief turns
  // away from the light (darker than a flat surface): flat spread keeps its
  // own colour, quark stays white
  float shade = 0.72 + 0.38 * diff;
  float away = clamp((L.z - diff) / L.z, 0.0, 1.0);
  vec3 shadeCol = mix(vec3(1.0), uShadeTint, away) * shade;
  col = mix(col, col * shadeCol, cover);
  col += spec * (0.05 + 1.2 * gloss) * cover * uSpecTint;

  // alpha: the slice mask
  return vec4(col, texture(uMask, uv).r);
}
`;function Af(e,t){let[n,r]=e instanceof HTMLImageElement?[e.naturalWidth,e.naturalHeight]:[e.width,e.height],i=Math.max(1,Math.round(t*r/n)),a=rf(e,t,i),o=new Float32Array(t*i);for(let e=0;e<o.length;e++)o[e]=a[e*4+3]/255;return{a:o,w:t,h:i}}function jf(e,t,n,r,i,a){let o=i-n,s=a-r,c=o*o+s*s,l=c>0?Math.max(0,Math.min(1,((e-n)*o+(t-r)*s)/c)):0,u=n+l*o-e,d=r+l*s-t;return u*u+d*d}function Mf(e,t){let n=new Uint8Array(e.length),r=[],i=0,a=-1;for(let t=1;t<e.length;t++){let n=(e[t][0]-e[0][0])**2+(e[t][1]-e[0][1])**2;n>a&&(a=n,i=t)}n[0]=n[i]=1,r.push([0,i],[i,e.length]);let o=t*t;for(;r.length;){let[t,i]=r.pop(),a=e[t],s=e[i%e.length],c=-1,l=-1;for(let n=t+1;n<i;n++){let t=jf(e[n][0],e[n][1],a[0],a[1],s[0],s[1]);t>c&&(c=t,l=n)}c>o&&(n[l]=1,r.push([t,l],[l,i]))}return e.filter((e,t)=>n[t])}function Nf(e,t){let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=e[(r+1)%e.length],o=Math.max(1,Math.ceil(Math.hypot(a[0]-i[0],a[1]-i[1])/t));for(let e=0;e<o;e++)n.push([i[0]+(a[0]-i[0])*e/o,i[1]+(a[1]-i[1])*e/o])}return n}function Pf(e,t=512,n=.35,r=1/128,i=.5){let{a,w:o,h:s}=Af(e,t),c=(e,t)=>e<0||t<0||e>=o||t>=s?0:a[t*o+e],l=o+2,u=(e,t)=>((t+1)*l+(e+1))*2,d=(e,t)=>((t+1)*l+(e+1))*2+1,f=new Map,p=new Map,m=(e,t)=>(i-e)/(t-e),h=(e,t,n)=>{f.has(e)||f.set(e,[t,n])},g=(e,t)=>{(p.get(e)??p.set(e,[]).get(e)).push(t),(p.get(t)??p.set(t,[]).get(t)).push(e)};for(let e=-1;e<s;e++)for(let t=-1;t<o;t++){let n=c(t,e),r=c(t+1,e),a=c(t+1,e+1),o=c(t,e+1),s=(n>=i?8:0)|(r>=i?4:0)|(a>=i?2:0)|o>=i;if(s===0||s===15)continue;let l=u(t,e),f=u(t,e+1),p=d(t,e),_=d(t+1,e);n>=i!=r>=i&&h(l,t+m(n,r),e),o>=i!=a>=i&&h(f,t+m(o,a),e+1),n>=i!=o>=i&&h(p,t,e+m(n,o)),r>=i!=a>=i&&h(_,t+1,e+m(r,a));let v=(n+r+a+o)/4>=i;switch(s){case 1:case 14:g(p,f);break;case 2:case 13:g(f,_);break;case 3:case 12:g(p,_);break;case 4:case 11:g(l,_);break;case 6:case 9:g(l,f);break;case 7:case 8:g(p,l);break;case 5:v?(g(p,l),g(f,_)):(g(p,f),g(l,_));break;case 10:v?(g(p,f),g(l,_)):(g(p,l),g(f,_))}}let _=new Set,v=[];for(let e of p.keys()){if(_.has(e))continue;let t=[],n=-1,r=e;for(;!_.has(r);){_.add(r),t.push(f.get(r));let e=p.get(r).find(e=>e!==n&&!_.has(e));if(e===void 0)break;n=r,r=e}t.length>v.length&&(v=t)}let y=0;for(let e=0;e<v.length;e++){let t=v[e],n=v[(e+1)%v.length];y+=t[0]*n[1]-n[0]*t[1]}return y<0&&v.reverse(),Nf(Mf(v,n).map(([e,t])=>[(e+.5)/o,(t+.5)/s]),r)}var Ff=4;function If(e,t,n,r){let i=t*n,a=new Int32Array(i+1),o=new Int32Array(e*4);for(let n=0;n<e;n++){let[e,i,s,c]=r(n);o[n*4]=e,o[n*4+1]=i,o[n*4+2]=s,o[n*4+3]=c;for(let n=s;n<=c;n++)for(let r=e;r<=i;r++)a[n*t+r+1]++}for(let e=0;e<i;e++)a[e+1]+=a[e];let s=new Int32Array(a[i]),c=Int32Array.from(a.subarray(0,i));for(let n=0;n<e;n++)for(let e=o[n*4+2];e<=o[n*4+3];e++)for(let r=o[n*4];r<=o[n*4+1];r++)s[c[e*t+r]++]=n;return{count:a,items:s}}function Lf(e,t,n,r,i,a){let o=1/0,s=Math.max(n,r);for(let c=0;c<s;c++){if(c>0){let e=(c-1)*i;if(e*e>o)break}for(let i=t-c;i<=t+c;i++){if(i<0||i>=r)continue;let s=i===t-c||i===t+c;for(let t=e-c;t<=e+c;t+=s?1:2*c)t<0||t>=n||(o=a(i*n+t,o))}}return o}function Rf(e){let t=e.length;if(t===0)return()=>0;let n=1/0,r=1/0,i=-1/0,a=-1/0;for(let[t,o]of e)n=Math.min(n,t),r=Math.min(r,o),i=Math.max(i,t),a=Math.max(a,o);let o=Math.max(1,Math.round(Math.sqrt(t/Ff))),s=Math.max(i-n,a-r,1e-9)/o,c=Math.max(1,Math.ceil((i-n)/s+1e-9)),l=Math.max(1,Math.ceil((a-r)/s+1e-9)),u=e=>Math.max(0,Math.min(c-1,Math.floor((e-n)/s))),d=e=>Math.max(0,Math.min(l-1,Math.floor((e-r)/s))),{count:f,items:p}=If(t,c,l,t=>{let n=u(e[t][0]),r=d(e[t][1]);return[n,n,r,r]}),m=Float64Array.from(e,e=>e[0]),h=Float64Array.from(e,e=>e[1]);return(e,t)=>{let n=0;return Lf(u(e),d(t),c,l,s,(r,i)=>{for(let a=f[r];a<f[r+1];a++){let r=p[a],o=(m[r]-e)**2+(h[r]-t)**2;(o<i||o===i&&r<n)&&(i=o,n=r)}return i}),n}}var zf=1.3/11;function Bf(e){zf=e/11}function Vf(e){zf=e}var Hf=.4/11,Uf=58,Wf=.035,Gf=2,Kf=2,qf=.6,Jf=520,Yf={sun:.12,bounce:.6,sides:.7,spread:.6,gloss:.75,glossWarm:.4,ao:.8,tone:1,exposure:1,low:.45,key:.45,cool:.4},Xf=1.8,Zf=1,Qf=.55,$f=1.3,ep=new X(-.35,.4).normalize();function tp(e){let t=an.degToRad(Uf+-26*e);return new Z(ep.x*Math.cos(t),ep.y*Math.cos(t),Math.sin(t))}var np=e=>`vec2(${e.x.toFixed(4)}, ${e.y.toFixed(4)})`,rp=24;function ip(e,t,n,r){let i=r?`uniform float ${r[0]};`:``;e.onBeforeCompile=e=>{r&&(e.uniforms[r[0]]=r[1]),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
varying vec2 vPlace;`).replace(`#include <project_vertex>`,`#include <project_vertex>
vPlace = (modelMatrix * vec4(transformed, 1.0)).xy;`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\nvarying vec2 vPlace;\n${i}`).replace(t,`${t}\n${n}`)}}var ap=new dr(12303291),op=new Map;function sp(e=1){if(e===1)return ap;let t=op.get(e);return t||op.set(e,t=ap.clone().multiplyScalar(e)),t}var cp=new dr(1,1,1),lp=new dr(1.12,.96,.74),up=new dr(1.34,.94,.57),dp=new dr(12303291),fp=new dr(13943718),pp=new Z(1,.86,.66),mp=new Z(1.06,1,.88),hp=new Z(1.14,1,.74),gp=new dr(.88,1,1.2),_p=new Z(.95,1,1.08),vp=new dr(2759180),yp=new dr(1316636),bp=new Z(1,.92,.76),xp=[.5465,.1947],Sp=[.3,.75];function Cp([e,t]){let n=n=>e+(n-xp[0])/xp[1]*t;return[n(Sp[0]),n(Sp[1])]}var wp=`
#include <common>
#include <shadowmap_pars_vertex>
uniform sampler2D uHeight;
uniform float uLift;
varying vec2 vUv;
void main() {
  // grid uv: (0,0) top-left
  vUv = vec2(uv.x, 1.0 - uv.y);
  #include <beginnormal_vertex>
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  transformed.z += texture2D(uHeight, vUv).r * uLift;
  #include <project_vertex>
  #include <worldpos_vertex>
  #include <shadowmap_vertex>
}`,Tp=.15/11,Ep=`
#include <common>
#include <packing>
#include <bsdfs>
#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
varying vec2 vUv;
uniform float uShadow;
uniform vec3 uShadowTint;
uniform sampler2D uContact;
uniform float uContactStrength;
uniform float uCreaseLit;   // the crease's strength on a topping's side towards the light
uniform float uCreaseShade; // and on its far side
uniform vec2 uToLight;   // towards the light across the slice per unit of height (x, y up)
uniform float uStandMax; // the height the contact texture's green records as 1
${kf}
void main() {
  vec4 c = shadeSlice(vUv);
  if (c.a < 0.02) discard;
  // shadows of the toppings: the photo light is soft, so not black. Right
  // at a topping's foot the shadow map fails: it holds the toppings' faces
  // turned from the light, and the spread next to such a face lies closer
  // to it than the bias, so a lit seam ran along the foot on the shadow
  // side (a pale line, plain on a GPU). There the shadow comes from the
  // contact texture instead: looking from here towards the light, a
  // topping that stands out of the spread high enough within that reach
  // shades this point (green: how high it stands, a share of uStandMax).
  // Most of the slice has no topping within that reach: one look at a
  // coarse level first (it spans more than the reach), the steps only near one.
  vec2 here = vec2(vUv.x, 1.0 - vUv.y);
  float foot = 0.0;
  if (textureLod(uContact, here + uToLight * (uStandMax * 0.5), 3.5).r > 0.0) {
    for (int k = 1; k <= 6; k++) {
      float need = float(k) / 6.0;
      vec4 f = textureLod(uContact, here + uToLight * (uStandMax * need), 0.0);
      float stands = f.g / max(f.r, 0.004);
      foot = max(foot, f.r * smoothstep(need - 0.1, need + 0.03, stands));
    }
  }
  // the sun's shadow is light, worked out in linear like every other
  // material's: uShadow is the sun's share of the light on a flat top, so
  // the slice in shadow keeps what a topping or the board keeps (taken as a
  // factor on the sRGB values the slice is drawn in, it went near black)
  float sun = mix(1.0, min(getShadowMask(), 1.0 - foot), uShadow);
  // contact shading right at the toppings' edges, where the shadow map leaks
  // light: their footprint (drawn from above, y up), blurred by reading
  // coarser mip levels, a little towards the shadow side (lower right)
  vec2 cuv = here + vec2(-0.004, 0.004);
  float contact = 0.5 * (textureLod(uContact, cuv, 1.5).r + textureLod(uContact, cuv, 3.0).r);
  // and all round a topping that lies in the spread, on the lit side too: the
  // crease between it and the spread gets little of the sky, darkest right
  // at it and fading over a couple of millimetres (narrow and faint, it was
  // not to be seen on a phone and the topping seemed to hover). The sky is a
  // window's: a crease whose topping lies towards the light (its far side)
  // gets less of it than one on the side the light comes from, so it is
  // darker there (one strength all round was heavy on the lit side or
  // weightless on the far one); which way the topping lies, from its
  // footprint a millimetre and a half each way along the light
  // (most of the slice has no crease: the two looks only near one)
  float crease = 0.6 * textureLod(uContact, here, 1.0).r + 0.4 * textureLod(uContact, here, 2.5).r;
  float creaseStrength = 0.0;
  if (crease > 0.0) {
    float toward = textureLod(uContact, here + ${np(ep.clone().multiplyScalar(Tp))}, 2.0).r;
    float away = textureLod(uContact, here - ${np(ep.clone().multiplyScalar(Tp))}, 2.0).r;
    creaseStrength = mix(uCreaseLit, uCreaseShade, clamp(0.5 + toward - away, 0.0, 1.0));
  }
  // the slice's look, these two included, is worked out on its photo's sRGB
  // values; from here on it is light like the rest, and three.js tone maps
  // and encodes it
  float near = (1.0 - uContactStrength * contact) * (1.0 - creaseStrength * crease);
  gl_FragColor = sRGBTransferEOTF(vec4(c.rgb * near, c.a));
  // shadow under daylight takes some warmth from the board and the bread
  // around it: blue drops a little more than red, so it is not a cold grey
  float dark = sun * sRGBTransferEOTF(vec4(near)).r;
  gl_FragColor.rgb *= sun * mix(vec3(1.0), uShadowTint, 1.0 - dark);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function Dp(e){let t=e instanceof HTMLCanvasElement?new Bi(e):new wn(e);return t.colorSpace=pt,t.anisotropy=4,t.needsUpdate=!0,t}function Op(e){let t=new wn(e);return t.flipY=!1,t.minFilter=ie,t.needsUpdate=!0,t}var kp=255;function Ap(e,t,n,r,i,a,o){let s=[],c=Math.hypot(t,n);for(let l=0;l<a;l++){let u=l/a*Math.PI*2,d=Math.cos(u),f=Math.sin(u),p=0;for(let a=0;a<c;a+=.5){let s=Math.round(r+d*a),c=Math.round(i+f*a);if(s<0||c<0||s>=t||c>=n)break;e[c*t+s]>=o&&(p=a)}s.push([r+d*p,i+f*p])}return s}var jp=1.15;function Mp(e,t,n){let r=e.length,i=e.map(e=>e.length()),a=e.map((e,t)=>{let n=0;for(let e=-3;e<=3;e++)n+=i[(t+e+r)%r];return e.clone().setLength(n/7)});a.push(a[0].clone());let o=[0];for(let e=1;e<a.length;e++)o.push(o[e-1]+a[e].distanceTo(a[e-1]));let s=o[a.length-1]/Math.max(1,Math.round(o[a.length-1]/(t*n))),c=[],l=[],u=[];a.forEach((e,n)=>{if(c.push(e.x,e.y,0,e.x,e.y,t),l.push(o[n]/s,0,o[n]/s,1),n>0){let e=(n-1)*2;u.push(e,e+1,e+2,e+1,e+3,e+2)}});let d=new si;return d.setAttribute(`position`,new Yr(c,3)),d.setAttribute(`uv`,new Yr(l,2)),d.setIndex(u),d.computeVertexNormals(),d}var Np=1.8/11,Pp=.45/11,Fp=.15/11,Ip=.92;function Lp(e){return Pf(e,632,.5,1,Ip)}var Rp=1.1;function zp(e,t){let n=e.length,r=e.map((t,r)=>{let i=e[(r+n-2)%n],a=e[(r+2)%n];return new X(a.y-i.y,-(a.x-i.x)).normalize()}),i=[],a=Pp*Math.PI/2;for(let e=0;e<=7;e++){let t=e/7*(Math.PI/2);i.push({inset:Pp*(1-Math.sin(t)),z:-Pp*(1-Math.cos(t)),nOut:Math.sin(t),nUp:Math.cos(t),read:Pp+Pp*t})}for(let e=0;e<=3;e++){let t=e/3*(Math.PI/2),n=-(Np-Fp)-Fp*Math.sin(t);i.push({inset:Fp*(1-Math.cos(t)),z:n,nOut:Math.cos(t),nUp:-Math.sin(t),read:a-n})}let o=[],s=[],c=[],l=[],u=i.length;for(let a=0;a<n;a++){let n=e[a],l=r[a];for(let e of i)o.push(n.x-l.x*e.inset,n.y-l.y*e.inset,e.z),s.push(l.x*e.nOut,l.y*e.nOut,e.nUp),c.push(...t(n.x-l.x*e.read,n.y-l.y*e.read))}for(let e=0;e<n;e++){let t=e*u,r=(e+1)%n*u;for(let e=0;e<u-1;e++)l.push(t+e,t+e+1,r+e,r+e,t+e+1,r+e+1)}let d=new si;d.setAttribute(`position`,new Yr(o,3)),d.setAttribute(`normal`,new Yr(s,3)),d.setAttribute(`uv`,new Yr(c,2)),d.setIndex(l);let f=new lo(new xa(e.map((e,t)=>e.clone().addScaledVector(r[t],-Pp)))),p=f.getAttribute(`position`),m=f.getAttribute(`uv`);for(let e=0;e<p.count;e++)m.setXY(e,...t(p.getX(e),p.getY(e)));return{top:f,side:d}}function Bp(e,t,n){let r=e.length,i=[0];for(let t=1;t<=r;t++)i.push(i[t-1]+e[t%r].distanceTo(e[t-1]));let a=i[r],o=Math.max(8,Math.round(a/t)),s=[];for(let t=0,n=0;t<o;t++){let c=t/o*a;for(;i[n+1]<c;)n++;let l=(c-i[n])/(i[n+1]-i[n]||1);s.push(e[n].clone().lerp(e[(n+1)%r],l))}let c=s.map((e,t)=>{let r=new X;for(let e=-n;e<=n;e++)r.add(s[(t+e+o)%o]);return r.divideScalar(2*n+1)}),l=0;for(let e=0;e<o;e++)l+=c[e].x*c[(e+1)%o].y-c[(e+1)%o].x*c[e].y;return l<0?c.reverse():c}function Vp(e){let t=.35,n=e.map(e=>e.x),r=e.map(e=>e.y),i=Math.min(...n)-t,a=Math.min(...r)-t,o=Math.max(...n)+t-i,s=Math.max(...r)+t-a,c=document.createElement(`canvas`);c.width=Math.round(o*160),c.height=Math.round(s*160);let l=c.getContext(`2d`);if(!l)throw Error(`2d context unavailable`);return l.fillStyle=`#000`,l.fillRect(0,0,c.width,c.height),l.filter=`blur(8px)`,l.fillStyle=`#fff`,l.beginPath(),e.forEach((e,t)=>{let n=(e.x-i)*160,r=(a+s-e.y)*160;t===0?l.moveTo(n,r):l.lineTo(n,r)}),l.closePath(),l.fill(),{tex:new Bi(c),x0:i,y0:a,w:o,h:s}}var Hp=class{renderer;scene=new pr;camera=new as(25,1,.1,100);canvas;get needsRender(){return this.needs}set needsRender(e){this.needs=e,e&&this.onNeed?.()}needs=!0;onNeed=null;held=!1;tilt=0;orbit=0;zoom=1;panX=0;panY=0;panZ=0;pivot=new Z(0,0,zf);fov=25;uniforms;specTint;footUniforms;frameRect={cx:0,cy:0,side:1,fov:25};ray=new Es;v2=new X;contactScene=new pr;contactCam=new os(-.5,.5,.5,-.5,0,2);contactTarget=new Dn(256,256,{depthBuffer:!1,generateMipmaps:!0,minFilter:ie,magFilter:H});contactsDirty=!0;clearColor=new dr;sun;ao=0;post=null;bufferSize=new X;hemi;slice=new ir;landStart=null;cameraDistance=1;tableImg;tableMat;tableDrawn={grain:0,blur:-1};boardFall={value:0};boardShadowMat=new fo;tableShadow;tableShadowAt=new X;constructor(e,t){let{placement:n}=t,r=t.maskSize;this.renderer=new nd({antialias:!0,powerPreference:`high-performance`}),window.addEventListener(`pagehide`,e=>{e.persisted||this.renderer.forceContextLoss()}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=1,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.canvas=this.renderer.domElement,this.canvas.className=`view`,e.prepend(this.canvas),this.scene.background=new dr(getComputedStyle(e).getPropertyValue(`--table`).trim()||`#1f150d`);let i=new qo(16777215,16777215,0);i.position.set(0,0,1),this.scene.add(i),this.hemi=i;let a=new cs(16777215,0);this.sun=a,a.castShadow=!0,a.shadow.mapSize.set(2048,2048);let o=a.shadow.camera;o.left=-1.6,o.right=1.6,o.top=1.6,o.bottom=-1.6,o.near=8.5,o.far=11.5,a.shadow.bias=-2e-4,a.shadow.normalBias=.001,a.shadow.radius=3,this.scene.add(a);let s=Rp/n.side,c=n.boardWidth*s,l=n.boardHeight*s,u=(n.boardWidth/2-(n.x+n.side/2))*s,d=-(n.boardHeight/2-(n.y+n.side/2))*s,f=Bp((t.boardOutline??Lp(t.boardImg)).map(([e,t])=>new X(u+(e-.5)*c,d-(t-.5)*l)),.006,3),{top:p,side:m}=zp(f,(e,t)=>[(e-u)/c+.5,(t-d)/l+.5]),h=new wo({map:Dp(t.boardImg)});ip(h,`#include <map_fragment>`,`diffuseColor.rgb *= 1.0 - boardFall * smoothstep(0.0, ${Xf.toFixed(3)}, -dot(vPlace, ${np(ep)}));`,[`boardFall`,this.boardFall]),this.scene.add(new ji(p,h),new ji(m,h));let g=Vp(f),_=new ji(new co(g.w,g.h),new yi({alphaMap:g.tex,color:0,transparent:!0,opacity:.55,depthWrite:!1}));this.tableShadowAt.set(g.x0+g.w/2,g.y0+g.h/2),_.position.z=-Np+5e-4,this.tableShadow=_,_.renderOrder=-2,this.scene.add(_),this.tableImg=t.tableImg,this.tableMat=new wo;let v=this.scene.background;ip(this.tableMat,`#include <opaque_fragment>`,`gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(${v.r.toFixed(4)}, ${v.g.toFixed(4)}, ${v.b.toFixed(4)}), smoothstep(${(Qf*c).toFixed(3)}, ${($f*c).toFixed(3)}, distance(vPlace, ${np(ep.clone().multiplyScalar(Zf))})));`);let y=new ji(new co(rp,rp),this.tableMat);y.position.z=-Np-.001,y.renderOrder=-4,this.scene.add(y),this.setTable(t.table);let b=new ji(p,this.boardShadowMat);b.position.z=.001,b.receiveShadow=!0,b.renderOrder=-1,this.scene.add(b);let x=Ap(t.maskBytes,r,r,r/2,r/2,480,kp).map(([e,t])=>new X(e/r-.5,.5-t/r)),S=Dp(t.crustImg);S.wrapS=L;let C=new ji(Mp(x,zf,t.crustImg.naturalWidth/t.crustImg.naturalHeight),new wo({map:S,color:new dr(jp,jp,jp)}));C.castShadow=!0,this.slice.add(C),this.scene.add(this.slice);let w=new wn(t.breadImg);w.flipY=!1,w.minFilter=ie,w.needsUpdate=!0,this.uniforms=vo.merge([Q.lights]),Object.assign(this.uniforms,{uBread:{value:w},uHeight:{value:null},uMask:{value:Op(t.edgeImg)},uMat:{value:null},uPar:{value:null},uUnder:{value:null},uTexel:{value:new X(1/512,1/512)},uGridScale:{value:1},uBreadTexel:{value:new X(1/512,1/512)},uHeightMax:{value:1},uBump:{value:t.bump},uLift:{value:Wf},uShadow:{value:0},uShadowTint:{value:mp.clone()},uSunTint:{value:new Z(1,1,1)},uPoreRange:{value:new X(...Cp(t.placement.crumb))},uShadeTint:{value:new Z(1,1,1)},uSpecTint:{value:new Z(1,1,1)},uContact:{value:this.contactTarget.texture},uContactStrength:{value:.3},uCreaseLit:{value:.2},uCreaseShade:{value:.5},uToLight:{value:new X},uStandMax:{value:Hf}}),this.specTint=this.uniforms.uSpecTint,this.footUniforms={uFootHeight:this.uniforms.uHeight,uFootMask:{value:null},uFootN:{value:1},uFootLift:this.uniforms.uLift,uFootTop:{value:zf}},this.contactCam.position.z=1;let T=new ji(new co(1,1,255,255),new xo({uniforms:this.uniforms,vertexShader:wp,fragmentShader:Ep,lights:!0,transparent:!0}));T.position.z=zf,T.receiveShadow=!0,this.slice.add(T),this.canvas.addEventListener(`webglcontextrestored`,()=>{this.renderer.shadowMap.needsUpdate=!0,this.contactsDirty=!0,this.needsRender=!0}),this.setLook(Yf)}setTable(e){if(e.grain!==this.tableDrawn.grain||e.blur!==this.tableDrawn.blur){this.tableDrawn={grain:e.grain,blur:e.blur};let t=this.tableImg,n=document.createElement(`canvas`);n.width=Math.max(8,Math.min(t.width,Math.round(e.grain*10/Math.max(e.blur,.001)))),n.height=Math.max(4,Math.round(n.width*t.height/t.width));let r=n.getContext(`2d`);if(!r)throw Error(`2d context unavailable`);r.imageSmoothingQuality=`high`,r.drawImage(t,0,0,n.width,n.height);let i=Dp(n);i.anisotropy=1,i.wrapS=i.wrapT=z;let a=e.grain/11;i.repeat.set(rp/a,rp/(a*t.height/t.width));let o=this.tableMat.map;o&&(nf(o.image),o.dispose()),this.tableMat.map=i,this.tableMat.needsUpdate=!0}this.tableMat.color.setScalar(e.shade),this.boardFall.value=e.board,this.needsRender=!0}setLook(e){let t=new dr().copy(cp).lerp(lp,e.sun),n=tp(e.low),r=Math.max(e.key,.02);this.sun.position.copy(n).multiplyScalar(10),this.sun.intensity=r*Math.PI/n.z,this.hemi.intensity=(1-r)*Math.PI;let i=r/((1-r)*(Math.max(gp.r,gp.g,gp.b)-1)),a=new dr().copy(cp).lerp(gp,Math.min(e.cool,i));this.hemi.color.copy(t).multiply(a);let o=e=>Math.max(0,(1-(1-r)*e)/r);this.sun.color.setRGB(o(a.r),o(a.g),o(a.b)).multiply(t),this.hemi.groundColor.copy(cp).lerp(up,e.bounce).multiply(t),this.boardShadowMat.opacity=r,this.boardShadowMat.color.copy(vp).lerp(yp,e.cool);let s=Np*.6/n.z;this.tableShadow.position.x=this.tableShadowAt.x-n.x*s,this.tableShadow.position.y=this.tableShadowAt.y-n.y*s,this.renderer.shadowMap.needsUpdate=!0;let c=t.clone().convertLinearToSRGB();this.uniforms.uSunTint.value.set(c.r,c.g,c.b),ap.copy(dp).lerp(fp,e.sides);for(let[e,t]of op)t.copy(ap).multiplyScalar(e);let l=this.uniforms;l.uShadeTint.value.set(1,1,1).lerp(pp,e.spread),l.uShadowTint.value.copy(mp).lerp(hp,e.spread).lerp(_p,e.cool),l.uShadow.value=r,l.uToLight.value.set(n.x/n.z,n.y/n.z),l.uSpecTint.value.set(1,1,1).lerp(bp,e.glossWarm).multiplyScalar(e.gloss),this.renderer.toneMapping=e.tone>=.5?7:1,this.renderer.toneMappingExposure=e.exposure,this.ao=e.ao,this.needsRender=!0}showSim(e){let t=this.uniforms,n=e.textures;[t.uHeight.value,t.uMat.value,t.uPar.value,t.uUnder.value]=[n.height,n.mat,n.par,n.under],t.uTexel.value.set(1/e.n,1/e.n),t.uGridScale.value=e.f,t.uHeightMax.value=e.p.heightMax,this.footUniforms.uFootMask.value=n.field,this.footUniforms.uFootN.value=e.n,this.canvas.addEventListener(`webglcontextrestored`,()=>e.restore()),this.needsRender=!0}get lift(){return Wf}get pxPerUnit(){return this.frameRect.side}layout(e,t,n,r,i,a=this.fov){this.renderer.setSize(e,t,!1),this.frameRect={cx:n,cy:r,side:i,fov:a},this.placeCamera()}placeCamera(){let e=this.canvas.clientWidth||1,t=this.canvas.clientHeight||1,n=this.camera;n.aspect=e/t;let{cx:r,cy:i,side:a,fov:o}=this.frameRect;n.fov=o;let s=t/(2*Math.tan(an.degToRad(o/2))*a)/this.zoom;this.cameraDistance=s,n.near=Math.min(.1,s*.05);let c=this.pivot.x+this.panX,l=this.pivot.y+this.panY,u=this.pivot.z+this.panZ,d=an.degToRad(this.tilt),f=an.degToRad(this.orbit);n.position.set(c+Math.sin(f)*Math.sin(d)*s,l-Math.cos(f)*Math.sin(d)*s,u+Math.cos(d)*s),n.up.set(-Math.sin(f),Math.cos(f),0),n.lookAt(c,l,u),n.setViewOffset(e,t,e/2-r,t/2-i,e,t),n.updateMatrixWorld(),this.needsRender=!0}gpuBytes(e){let t=new Set,n=new Set(e),r=0,i=0,a=e=>{if(!(e instanceof wn)||t.has(e))return;t.add(e);let a=e.image;if(!a?.width||!a.height)return;let o=a.width*a.height*4*(e.generateMipmaps&&e.minFilter!==1006&&e.minFilter!==1003?4/3:1);r+=o,n.has(e)&&(i+=o)},o=e=>{for(let t of Object.values(e))a(t);if(`uniforms`in e)for(let t of Object.values(e.uniforms))a(t.value)};for(let e of[this.scene,this.contactScene])e.traverse(e=>{let t=e;if(t.material)for(let e of[t.material].flat())o(e);t.customDepthMaterial&&o(t.customDepthMaterial)});let s=this.sun.shadow.mapSize,c=this.sun.shadow.map?s.x*s.y*4:0;return{textures:this.renderer.info.memory.textures,pictures:r,photos:i,shadow:c}}shadowsChanged(){this.renderer.shadowMap.needsUpdate=!0,this.contactsDirty=!0,this.needsRender=!0}pointOnPlane(e,t,n,r=new Z,i){return this.rayThrough(e,t),this.rayOnPlane(n,r,i)}rayThrough(e,t,n){let r=this.canvas.getBoundingClientRect();this.v2.set((e-r.left)/r.width*2-1,-((t-r.top)/r.height)*2+1),this.ray.setFromCamera(this.v2,this.camera),n?.copy(this.ray.ray)}rayOnPlane(e,t=new Z,n,r=this.ray.ray){let i=r.origin,a=r.direction,o=n?.ax??0,s=n?.ay??0,c=(e+o*(i.x-(n?.x??0))+s*(i.y-(n?.y??0))-i.z)/(a.z-o*a.x-s*a.y);return!Number.isFinite(c)||c<0?null:r.at(c,t)}toScreen(e){let t=e.clone().project(this.camera),n=this.canvas.getBoundingClientRect();return[n.left+(t.x+1)/2*n.width,n.top+(1-t.y)/2*n.height]}get landing(){return this.landStart!==null}land(){this.landStart=performance.now(),this.needsRender=!0}stepLanding(e){if(this.landStart===null)return;let t=Math.min(1,(e-this.landStart)/Jf),n=t<.62?1-(t/.62)**2:.05*Math.sin((t-.62)/.38*Math.PI)*(1-t);this.slice.position.z=n*qf,this.slice.rotation.z=n*.12,this.renderer.shadowMap.needsUpdate=!0,this.needsRender=!0,t>=1&&(this.slice.position.z=0,this.slice.rotation.z=0,this.landStart=null)}capture(e,t,n){let r=this.renderer,i=this.canvas.clientWidth||1,a=this.canvas.clientHeight||1,o=r.getPixelRatio(),s=this.camera,{cx:c,cy:l}=this.frameRect;s.setViewOffset(i,a,e.left+i/2-c,e.top+a/2-l,e.width,e.height),r.setPixelRatio(1),r.setSize(t,n,!1),this.needsRender=!0,this.render();let u=document.createElement(`canvas`);return u.width=t,u.height=n,u.getContext(`2d`).drawImage(this.canvas,0,0),r.setPixelRatio(o),r.setSize(i,a,!1),this.placeCamera(),this.render(),u}render(e=performance.now()){if(this.stepLanding(e),!this.needsRender||this.held)return!1;let t=this.renderer;if(this.contactsDirty){t.getClearColor(this.clearColor);let e=t.getClearAlpha();t.setRenderTarget(this.contactTarget),t.setClearColor(0,1),t.clear(),t.render(this.contactScene,this.contactCam),t.setRenderTarget(null),t.setClearColor(this.clearColor,e),this.contactsDirty=!1}return this.draw(),this.needsRender=!1,!0}async compileAhead(e=this.scene,t=this.contactScene){let n=this.renderer;if(!n.extensions.has(`KHR_parallel_shader_compile`))return!1;let r=this.ao>0?this.postTargets(n.getDrawingBufferSize(this.bufferSize)).scene:null;n.setRenderTarget(r);let i=n.compileAsync(e,this.camera,this.scene);n.setRenderTarget(this.contactTarget);let a=n.compileAsync(t,this.contactCam,this.contactScene);return n.setRenderTarget(null),await Promise.all([i,a]),!0}draw(){let e=this.renderer;if(this.ao<=0){e.render(this.scene,this.camera);return}let{scene:t,gtao:n,blended:r,out:i}=this.postTargets(e.getDrawingBufferSize(this.bufferSize));e.setRenderTarget(t),e.render(this.scene,this.camera),n.blendIntensity=this.ao,n.render(e,r,t,0,!1),i.render(e,t,r,0,!1),e.setRenderTarget(null)}postTargets(e){if(!this.post){let t={type:ae,colorSpace:pt},n=new Dn(e.x,e.y,{...t,samples:Gf});n.depthTexture=new Vi(e.x,e.y);let r=new Ef(this.scene,this.camera,e.x/Kf,e.y/Kf);r.setGBuffer(n.depthTexture),r.updateGtaoMaterial({radius:.12,distanceExponent:2,thickness:1,scale:1.5,samples:16});let i=new Dn(e.x,e.y,{...t,depthBuffer:!1}),a=new Of;a.renderToScreen=!0,this.post={scene:n,gtao:r,blended:i,out:a}}let t=this.post;return(t.scene.width!==e.x||t.scene.height!==e.y)&&(t.scene.setSize(e.x,e.y),t.gtao.setSize(e.x/Kf,e.y/Kf),t.blended.setSize(e.x,e.y)),t}};function Up(e,t,n,r){let i={...t},a=Object.keys(t),o=e?.split(`,`).map(e=>e.trim()===``?NaN:Number(e));return!o||o.length>a.length||o.length<(r??a.length)||!o.every(Number.isFinite)||a.slice(0,o.length).forEach((e,t)=>{let[r,a]=n(e);i[e]=Math.min(a,Math.max(r,o[t]))}),i}function Wp(e){return Object.keys(e).map(t=>+e[t].toFixed(2)).join(`,`)}function Gp(e,t){return Object.keys(t).some(n=>Math.abs(e[n]-t[n])>1e-6)?Wp(e):null}var Kp={shade:.25,blur:2,grain:34,board:.56},qp={shade:[0,1],blur:[0,6],grain:[10,80],board:[0,1]},Jp=e=>Up(e,Kp,e=>qp[e]);function Yp(e,t,n,r,i){let a=(e+t)/2;if(t-e<=i)return a;let o=r-i/2,s=n+i/2;return o>s?(n+r)/2:Math.min(s,Math.max(o,a))}var Xp=[15],Zp=[1,.7];function Qp(e,t){let n=Math.min(Math.max(0,t),Xp.length);for(;n<Xp.length&&e>=Xp[n];)n++;for(;n>0&&e<Xp[n-1]-2;)n--;return n}function $p(e,t=2166136261){for(let n=0;n<e.length;n++)t=Math.imul(t^e[n],16777619);return t>>>0}function em(e,t,n){let r=e.length,i=()=>Array.from({length:r},(e,t)=>t);if(r<4)return i();let a=1/0,o=-1/0;for(let i=0;i<r;i++)a=Math.min(a,e[i],t[i],n[i]),o=Math.max(o,e[i],t[i],n[i]);let s=1e-9*Math.max(.001,o-a),c=0,l=0;for(let n=1;n<r;n++)(e[n]<e[c]||e[n]===e[c]&&t[n]<t[c])&&(c=n),(e[n]>e[l]||e[n]===e[l]&&t[n]>t[l])&&(l=n);let u=e[l]-e[c],d=t[l]-t[c],f=n[l]-n[c],p=Math.hypot(u,d,f);if(p<=s)return[c];let m=-1,h=s;for(let i=0;i<r;i++){let r=e[i]-e[c],a=t[i]-t[c],o=n[i]-n[c],s=d*o-f*a,l=f*r-u*o,g=u*a-d*r,_=Math.hypot(s,l,g)/p;_>h&&(h=_,m=i)}if(m<0)return[c,l];let g=d*(n[m]-n[c])-f*(t[m]-t[c]),_=f*(e[m]-e[c])-u*(n[m]-n[c]),v=u*(t[m]-t[c])-d*(e[m]-e[c]),y=Math.hypot(g,_,v);g/=y,_/=y,v/=y;let b=-1;h=s;for(let i=0;i<r;i++){let r=Math.abs(g*(e[i]-e[c])+_*(t[i]-t[c])+v*(n[i]-n[c]));r>h&&(h=r,b=i)}return b<0?tm(e,t,n,r,Math.abs(v)>1e-6?null:[u,d],s):nm(e,t,n,r,[c,l,m,b],s)}function tm(e,t,n,r,i,a){let o=new Float64Array(r),s=new Float64Array(r);for(let a=0;a<r;a++)i?(o[a]=e[a]*i[0]+t[a]*i[1],s[a]=n[a]):(o[a]=e[a],s[a]=t[a]);let c=Array.from({length:r},(e,t)=>t).sort((e,t)=>o[e]-o[t]||s[e]-s[t]),l=(e,t,n)=>(o[t]-o[e])*(s[n]-s[e])-(s[t]-s[e])*(o[n]-o[e]),u=[];for(let e=r-1;e>=0;e--){let t=c[e];for(;u.length>=2&&l(u[u.length-2],u[u.length-1],t)<=a*a;)u.pop();u.push(t)}if(i)return u.sort((e,t)=>e-t);let d=[];for(let e=0;e<r;e++){let t=c[e];for(;d.length>=2&&l(d[d.length-2],d[d.length-1],t)<=a*a;)d.pop();d.push(t)}return[...new Set([...d,...u])].sort((e,t)=>e-t)}function nm(e,t,n,r,i,a){let[o,s,c,l]=i,u=(e[o]+e[s]+e[c]+e[l])/4,d=(t[o]+t[s]+t[c]+t[l])/4,f=(n[o]+n[s]+n[c]+n[l])/4,p=[],m=(r,i,a)=>{let o=e[i]-e[r],s=t[i]-t[r],c=n[i]-n[r],l=e[a]-e[r],m=t[a]-t[r],h=n[a]-n[r],g=s*h-c*m,_=c*l-o*h,v=o*m-s*l,y=Math.hypot(g,_,v)||1;g/=y,_/=y,v/=y,g*(u-e[r])+_*(d-t[r])+v*(f-n[r])>0&&(g=-g,_=-_,v=-v,[i,a]=[a,i]);let b={a:r,b:i,c:a,nx:g,ny:_,nz:v,off:g*e[r]+_*t[r]+v*n[r],outside:[],alive:!0};return p.push(b),b},h=(r,i)=>r.nx*e[i]+r.ny*t[i]+r.nz*n[i]-r.off,g=(e,t)=>{for(let n of e)for(let e of t)if(h(e,n)>a){e.outside.push(n);break}},_=[m(o,s,c),m(o,s,l),m(o,c,l),m(s,c,l)],v=[];for(let e=0;e<r;e++)e!==o&&e!==s&&e!==c&&e!==l&&v.push(e);for(g(v,_);;){let e=p.find(e=>e.alive&&e.outside.length>0);if(!e)break;let t=e.outside[0],n=-1/0;for(let r of e.outside){let i=h(e,r);i>n&&(n=i,t=r)}let r=p.filter(e=>e.alive&&h(e,t)>a),i=new Map;for(let e of r){e.alive=!1;for(let[t,n]of[[e.a,e.b],[e.b,e.c],[e.c,e.a]]){let e=`${n}:${t}`;i.has(e)?i.delete(e):i.set(`${t}:${n}`,[t,n])}}let o=[];for(let[e,n]of i.values())o.push(m(e,n,t));let s=[];for(let e of r)for(let n of e.outside)n!==t&&s.push(n);g(s,o)}let y=new Set;for(let e of p)!e.alive||e.nz<=1e-9||(y.add(e.a),y.add(e.b),y.add(e.c));return y.size>0?[...y].sort((e,t)=>e-t):Array.from({length:r},(e,t)=>t)}var rm=45*Math.PI/180,im=Math.tan(rm),am=1e-9,om=Array.from({length:8},(e,t)=>[Math.cos(t*Math.PI/4),Math.sin(t*Math.PI/4)]),sm=0,cm=0,lm=new Float64Array,um=new Float64Array,dm=new Float64Array,fm=new Int32Array;function pm(e){if(lm.length>=e)return;let t=Math.max(e,lm.length*2,256);lm=new Float64Array(t),um=new Float64Array(t),dm=new Float64Array(t),fm=new Int32Array(t)}function mm(e,t,n,r,i,a,o=rm,s={h:0,ax:0,ay:0,capped:!1}){pm(e);let c=0,l=1/0,u=-1/0;for(let o=0;o<e;o++){let e=r[o];e>-1/0&&(lm[c]=t[o]-i,um[c]=n[o]-a,dm[c]=e,fm[c]=c,c++,e<l&&(l=e),e>u&&(u=e))}if(s.ax=0,s.ay=0,s.capped=!1,c===0)return s.h=-1/0,s;if(u-l<=am&&vm(c))return s.h=u,s;let d=-1640531527;for(let e=c-1;e>0;e--){d^=d<<13,d^=d>>>17,d^=d<<5;let t=(d>>>0)%(e+1),n=fm[e];fm[e]=fm[t],fm[t]=n}let f=Math.tan(o),p=-1/0,m=0,h=0;for(let e=0;e<c;e++){let t=fm[e];p+m*lm[t]+h*um[t]>=dm[t]-am||(hm(t,e,f),m=sm,h=cm,p=dm[t]-m*lm[t]-h*um[t])}return s.h=p,s.ax=m,s.ay=h,s.capped=om.some(([e,t])=>e*m+t*h>=f-1e-12),s}function hm(e,t,n){let r=lm[e],i=um[e];gm(r,i,n);let a=sm,o=cm;for(let s=0;s<t;s++){let t=fm[s],c=r-lm[t],l=i-um[t],u=dm[e]-dm[t];c*a+l*o<=u+am||(_m(e,c,l,u,s,r,i,n),a=sm,o=cm)}sm=a,cm=o}function gm(e,t,n){let r=Math.hypot(e,t);if(sm=0,cm=0,r<1e-15)return;for(let[i,a]of om)if(i*e+a*t>0&&Math.abs(i*t-a*e)<1e-12*r){sm=i*n,cm=a*n;return}let i=(Math.floor(Math.atan2(t,e)/(Math.PI/4))+.5)*(Math.PI/4),a=n/Math.cos(Math.PI/8);sm=Math.cos(i)*a,cm=Math.sin(i)*a}function _m(e,t,n,r,i,a,o,s){let c=t*t+n*n,l=t*r/c,u=n*r/c,d=-n,f=t,p=-1/0,m=1/0;for(let t=-8;t<i;t++){let n,r,i;if(t<0){let e=om[t+8];n=e[0],r=e[1],i=s}else{let a=fm[t];n=lm[e]-lm[a],r=um[e]-um[a],i=dm[e]-dm[a]}let a=n*d+r*f;if(Math.abs(a)<1e-15*c)continue;let o=(i-(n*l+r*u))/a;a>0?m=Math.min(m,o):p=Math.max(p,o)}let h;if(p>m)h=(p+m)/2;else{let e=a*d+o*f;h=e>1e-15*c?m:e<-1e-15*c?p:Math.min(m,Math.max(p,-(l*d+u*f)/c))}sm=l+h*d,cm=u+h*f}function vm(e){let t=!1,n=!1,r=!1,i=!1;for(let a=0;a<e&&!(t&&n&&r&&i);a++)lm[a]<=0&&(t=!0),lm[a]>=0&&(n=!0),um[a]<=0&&(r=!0),um[a]>=0&&(i=!0);return t&&n&&r&&i}function ym(e){if(e.length<3)return e;e.sort((e,t)=>e[0]-t[0]||e[1]-t[1]);let t=(e,t,n)=>(t[0]-e[0])*(n[1]-e[1])-(t[1]-e[1])*(n[0]-e[0]),n=e=>{let n=[];for(let r of e){for(;n.length>=2&&t(n[n.length-2],n[n.length-1],r)<=0;)n.pop();n.push(r)}return n.slice(0,-1)};return n(e).concat(n([...e].reverse()))}function bm(e,t,n){let r=1/0;for(let i=0;i<e.length;i++){let[a,o]=e[i],[s,c]=e[(i+1)%e.length],l=Math.hypot(s-a,c-o)||1,u=((s-a)*(n-o)-(c-o)*(t-a))/l;u<r&&(r=u)}return r}function xm(e,t,n,r){return e.length>=3&&bm(e,t,n)>=r}function Sm(e){let t=0,n=0;for(let[r,i]of e)t+=r,n+=i;return[t/e.length,n/e.length]}function Cm(e,t,n,r,i){return e.h+e.ax*(r-t)+e.ay*(i-n)}function wm(e,t,n){return e*Math.hypot(1,t,n)}function Tm(e,t,n){let r=0,i=0,a=0;for(let o=0;o<n;o++)for(let n=0;n<t;n++)e[o*t+n]<128||(r+=n+.5,i+=o+.5,a++);return a?[r/a/t,i/a/n]:[.5,.5]}function Em(e){let t=0;for(let n=0;n<e.length;n++)e[n]>=128&&t++;return e.length?t/e.length:0}var Dm=.001,Om=.95,km=e=>2*e,Am=.01,jm=.995,Mm=1e-7,Nm=1e-7,Pm=1e-13,Fm=1e-9,Im=1e-9,Lm=.1,Rm=10,zm=1e-6,Bm=e=>e.on.v.length+e.under.c.length+e.over.reduce((e,t)=>e+t.d.length,0)>0;function Vm(e,t,n,r,i,a,o,s,c,l,u=Om){let d=n*n,f=km(n),p=f+1,m=e=>!t||t[e]!==0;s.length=0;for(let e=0;e<o.length;e++)s.push({h:-1/0,ax:0,ay:0,capped:!1});c&&(c.rounds=0,c.converged=!0);let h=!1;for(let e=0;e<d&&!h;e++)h=m(e);let g=new Float32Array(d);if(!h||n<3){for(let t=0;t<d;t++)g[t]=e[t];return g}let _=new Int32Array(o.length).fill(-1),v=0;for(let e=0;e<o.length;e++)Bm(o[e])&&(_[e]=v++);let y=3*v,b=d+y,{A:x,maxDiag:S}=Um(t,n,r,i,a*a*a),C=1;for(let e of o)C=Math.max(C,e.weight);let w=0;for(let e=0;e<d;e++)m(e)&&w++;w+=2*(n*(n-1))*2;for(let e=0;e<o.length;e++){if(_[e]<0)continue;let t=o[e];w+=t.on.v.length+t.under.c.length+8;for(let e of t.over)_[e.load]>=0&&(w+=e.d.length)}let T=new Int8Array(w),E=new Int32Array(w*6),D=new Float64Array(w*6),O=new Float64Array(w),k=new Int32Array(o.length).fill(-1),A=0;for(let e=0;e<o.length;e++)_[e]>=0&&(A+=o[e].on.v.length);let j=new Int32Array(A),M=new Int32Array(A),N=0,P=0,F=(e,...t)=>{T[P]=t.length/2;for(let e=0;e<t.length;e+=2)E[P*6+e/2]=t[e],D[P*6+e/2]=t[e+1];O[P]=e,P++},I=u*r,ee=u*i;for(let t=0;t<d;t++)m(t)&&F(e[t],t,1);for(let e=0;e<d;e++)e%n<n-1&&(F(-I,e,1,e+1,-1),F(-I,e,-1,e+1,1)),e+n<d&&(F(-ee,e,1,e+n,-1),F(-ee,e,-1,e+n,1));let te=e=>d+3*_[e];for(let e=0;e<o.length;e++){if(_[e]<0)continue;let t=o[e],n=te(e);for(let e=0;e<t.on.v.length;e++)F(t.on.off[e],t.on.v[e],-1,n,1,n+1,t.on.x[e]-t.cx,n+2,t.on.y[e]-t.cy),j[N]=t.on.v[e],M[N++]=n-d;for(let e=0;e<t.under.c.length;e++)F(t.under.c[e],n,1,n+1,t.under.x[e]-t.cx,n+2,t.under.y[e]-t.cy);for(let e of t.over){if(_[e.load]<0)continue;let r=o[e.load],i=te(e.load);for(let a=0;a<e.d.length;a++)F(e.d[a],n,1,n+1,e.x[a]-t.cx,n+2,e.y[a]-t.cy,i,-1,i+1,-(e.x[a]-r.cx),i+2,-(e.y[a]-r.cy))}k[e]=P;for(let[e,t]of om)F(-im,n+1,e,n+2,t)}let L=new Float64Array(b),R=new Float64Array(w),z=new Float64Array(w);for(let t=0;t<d;t++)L[t]=m(t)?e[t]:-1/0;for(let e=0;e<d;e++)e%n>0&&(L[e]=Math.max(L[e],L[e-1]-I)),e>=n&&(L[e]=Math.max(L[e],L[e-n]-ee));for(let e=d-1;e>=0;e--)e%n<n-1&&(L[e]=Math.max(L[e],L[e+1]-I)),e+n<d&&(L[e]=Math.max(L[e],L[e+n]-ee));for(let e=0;e<d;e++)L[e]>-1/0||(L[e]=0);for(let e=0;e<o.length;e++){if(_[e]<0)continue;let t=o[e],n=te(e),r=-1/0;for(let e=0;e<t.on.v.length;e++)r=Math.max(r,L[t.on.v[e]]+t.on.off[e]);for(let e=0;e<t.under.c.length;e++)r=Math.max(r,t.under.c[e]);for(let e of t.over){if(_[e.load]<0)continue;let t=te(e.load);for(let n=0;n<e.d.length;n++)r=Math.max(r,L[t]+e.d[n])}L[n]=r>-1/0?r:0,L[n+1]=0,L[n+2]=0}let B=e=>{let t=-O[e];for(let n=0;n<T[e];n++)t+=D[e*6+n]*L[E[e*6+n]];return t},ne=Lm*Math.min(r,i);for(let e=0;e<w;e++)R[e]=Math.max(B(e),ne),z[e]=Rm;let V=new Uint32Array(w);if(l){let e=new Uint32Array(7);for(let t=0;t<w;t++){e[0]=T[t];for(let n=0;n<6;n++)e[n+1]=n<T[t]?E[t*6+n]:0;V[t]=$p(e)}}let H=l?.last,re=!!H&&H.x.length===b;if(c&&(c.warm=re),re){L.set(H.x);let e=0;for(let t=0;t<w;t++)e=Math.max(e,-B(t));let t=Math.max(Am*ne,e),n=Am*Rm,r=new Map;for(let e=0;e<H.groups.length;e++){let t=H.groups[e],n=r.get(t);n?n.push(H.lam[e]):r.set(t,[H.lam[e]])}let i=new Map;for(let e=0;e<w;e++)i.set(V[e],(i.get(V[e])??0)+1);let a=new Map;for(let e=0;e<w;e++){R[e]=Math.max(B(e),t);let o=V[e],s=a.get(o)??0;a.set(o,s+1);let c=r.get(o),l=0;c&&c.length===i.get(o)?l=c[s]:c&&(l=c.reduce((e,t)=>e+t,0)/i.get(o)),z[e]=Math.max(l,n)}}let ie=new Float64Array(b),ae=new Float64Array(w),oe=new Float64Array(w),se=new Float64Array(w),ce=new Float64Array(b),le=new Float64Array(b),U=new Float64Array(w),ue=new Float64Array(w),de=new Float64Array(w),fe=new Float64Array(w),W=new Float64Array(d*p),pe=new Float64Array(d*y),me=new Float64Array(y*d),he=new Int32Array(y),ge=new Float64Array(y*y),_e=new Float64Array(y*y),ve=new Float64Array(d),ye=Im*S,be=Im*C,G=qm(d,f,y,j,M,N),xe=(e,t)=>G(W,pe,_e,e,t),Se=()=>{for(let e=0;e<w;e++)se[e]=(oe[e]+z[e]*ae[e])/R[e];for(let e=0;e<b;e++)ce[e]=-ie[e];for(let e=0;e<w;e++)for(let t=0;t<T[e];t++)ce[E[e*6+t]]-=D[e*6+t]*se[e];xe(ce,le);for(let e=0;e<w;e++){let t=ae[e];for(let n=0;n<T[e];n++)t+=D[e*6+n]*le[E[e*6+n]];U[e]=t,ue[e]=-(oe[e]+z[e]*t)/R[e]}},Ce=()=>{let e=1;for(let t=0;t<w;t++)U[t]<0&&(e=Math.min(e,-R[t]/U[t])),ue[t]<0&&(e=Math.min(e,-z[t]/ue[t]));return e},we=0,Te=!1;for(;we<80;){for(let e=0;e<d;e++)ie[e]=Gm(x,d,f,L,e)+ +!!m(e);for(let e=0;e<o.length;e++){if(_[e]<0)continue;let t=te(e);ie[t]=o[e].weight,ie[t+1]=0,ie[t+2]=0}let e=0,t=0;for(let n=0;n<w;n++){let r=B(n)-R[n];ae[n]=r,e=Math.max(e,Math.abs(r)),t+=R[n]*z[n];for(let e=0;e<T[n];e++)ie[E[n*6+e]]-=D[n*6+e]*z[n]}let n=0;for(let e=0;e<b;e++)n=Math.max(n,Math.abs(ie[e]));let r=0;for(let e=0;e<d;e++)r=Math.max(r,Math.abs(L[e]));let i=t/w;if(e<=Mm&&n<=Nm*C+Pm*S*r&&i<=Fm*C){Te=!0;break}we++,W.set(x);for(let e=0;e<d;e++)W[e*p]+=ye;pe.fill(0),ge.fill(0);for(let e=0;e<y;e++)ge[e*y+e]=be;for(let e=0;e<w;e++){let t=z[e]/R[e],n=T[e];if(n===1)W[E[e*6]*p]+=t;else if(n===2&&E[e*6+1]<d){let n=E[e*6],r=E[e*6+1];W[n*p]+=t,W[r*p]+=t,W[r*p+(r-n)]-=t}else for(let r=0;r<n;r++){let i=E[e*6+r],a=D[e*6+r]*t;for(let t=0;t<n;t++){let n=E[e*6+t],r=a*D[e*6+t];i<d?n<d?n<=i&&(W[i*p+(i-n)]+=r):pe[i*y+(n-d)]+=r:n>=d&&(ge[(i-d)*y+(n-d)]+=r)}}}Km(W,d,f);for(let e=0;e<y;e++){let t=d;for(let n=0;n<d&&t===d;n++)pe[n*y+e]!==0&&(t=n);he[e]=t;for(let n=t;n<d;n++)ve[n]=pe[n*y+e];Jm(W,d,f,ve,t),me.set(ve.subarray(t,d),e*d+t)}_e.set(ge);for(let e=0;e<y;e++)for(let t=0;t<=e;t++){let n=0;for(let r=Math.max(he[e],he[t]);r<d;r++)n+=me[e*d+r]*me[t*d+r];_e[e*y+t]-=n}Xm(_e,y);for(let e=0;e<w;e++)oe[e]=R[e]*z[e];Se();let a=Ce(),s=0;for(let e=0;e<w;e++)s+=(R[e]+a*U[e])*(z[e]+a*ue[e]);let c=Math.min(1,(s/t)**3);de.set(U),fe.set(ue);for(let e=0;e<w;e++)oe[e]=R[e]*z[e]+de[e]*fe[e]-c*i;Se();let l=Math.min(1,jm*Ce());for(let e=0;e<b;e++)L[e]+=l*le[e];for(let e=0;e<w;e++)R[e]+=l*U[e],z[e]+=l*ue[e]}c&&(c.rounds=we,c.converged=Te),l&&(l.last={x:L.slice(),groups:V,lam:z.slice()});for(let t=0;t<d;t++)g[t]=m(t)?Math.max(e[t],L[t]):L[t];for(let e=0;e<o.length;e++){if(_[e]<0)continue;let t=te(e),n=s[e];n.h=L[t],n.ax=L[t+1],n.ay=L[t+2];let r=0;for(let t=0;t<8;t++)r=Math.max(r,z[k[e]+t]);n.capped=r>zm*C}return g}var Hm=new WeakMap;function Um(e,t,n,r,i){let a=e?Hm.get(e):void 0;if(a&&a.cols===t&&a.hx===n&&a.hy===r&&a.l3===i)return a;let o=Wm(e,t,n,r,i),s=km(t)+1,c=0;for(let e=0;e<t*t;e++)c=Math.max(c,o[e*s]);let l={cols:t,hx:n,hy:r,l3:i,A:o,maxDiag:c};return e&&Hm.set(e,l),l}function Wm(e,t,n,r,i){let a=t*t,o=km(t)+1,s=new Float64Array(a*o),c=t=>!e||e[t]!==0,l=(e,t,n)=>{let r=e.every(c)?n*i:n*i*Dm;for(let n=0;n<e.length;n++)for(let i=0;i<e.length;i++){let a=e[n],c=e[i];c>a||(s[a*o+(a-c)]+=r*t[n]*t[i])}},u=1/(n*n),d=1/(r*r),f=1/(n*r);for(let e=0;e<t;e++)for(let n=0;n<t;n++){let r=e*t+n;n>0&&n<t-1&&l([r-1,r,r+1],[u,-2*u,u],1),e>0&&e<t-1&&l([r-t,r,r+t],[d,-2*d,d],1),n<t-1&&e<t-1&&l([r,r+1,r+t,r+t+1],[f,-f,-f,f],2)}return s}function Gm(e,t,n,r,i){let a=n+1,o=e[i*a]*r[i];for(let s=1;s<=n;s++)i-s>=0&&(o+=e[i*a+s]*r[i-s]),i+s<t&&(o+=e[(i+s)*a+s]*r[i+s]);return o}function Km(e,t,n,r=!1){let i=n+1;for(let a=0;a<t;a++){let t=Math.max(0,a-n),o=a*i+a,s=e[o-a];for(let n=t;n<=a;n++){let c=n*i+n,l=e[o-n];for(let r=t;r<n;r++)l-=e[o-r]*e[c-r];if(n===a){if(r&&!(l>1e-12*s))return!1;e[o-a]=Math.sqrt(r?l:Math.max(l,1e-300))}else e[o-n]=l/e[c-n]}}return!0}function qm(e,t,n,r,i,a){let o=new Float64Array(e),s=new Float64Array(n);return(c,l,u,d,f)=>{for(let t=0;t<e;t++)o[t]=d[t];Ym(c,e,t,o);for(let t=0;t<n;t++)s[t]=d[e+t];for(let e=0;e<a;e++){let t=r[e],a=i[e];for(let e=a;e<a+3;e++)s[e]-=l[t*n+e]*o[t]}Zm(u,n,s);for(let t=0;t<e;t++)f[t]=d[t];for(let e=0;e<a;e++){let t=r[e],a=i[e];for(let e=a;e<a+3;e++)f[t]-=l[t*n+e]*s[e]}Ym(c,e,t,f);for(let t=0;t<n;t++)f[e+t]=s[t]}}function Jm(e,t,n,r,i=0){let a=n+1;for(let o=i;o<t;o++){let t=o*a+o,s=r[o];for(let a=Math.max(i,o-n);a<o;a++)s-=e[t-a]*r[a];r[o]=s/e[t-o]}}function Ym(e,t,n,r){let i=n+1;Jm(e,t,n,r);for(let a=t-1;a>=0;a--){let o=r[a],s=Math.min(t-1,a+n);for(let t=a+1,n=(a+1)*i+1;t<=s;t++,n+=i+1)o-=e[n]*r[t];r[a]=o/e[a*i]}}function Xm(e,t,n=!1){for(let r=0;r<t;r++)for(let i=0;i<=r;i++){let a=e[r*t+i];for(let n=0;n<i;n++)a-=e[r*t+n]*e[i*t+n];if(i===r){if(n&&!(a>0))return!1;e[r*t+r]=Math.sqrt(n?a:Math.max(a,1e-300))}else e[r*t+i]=a/e[i*t+i]}return!0}function Zm(e,t,n){for(let r=0;r<t;r++){let i=n[r];for(let a=0;a<r;a++)i-=e[r*t+a]*n[a];n[r]=i/e[r*t+r]}for(let r=t-1;r>=0;r--){let i=n[r];for(let a=r+1;a<t;a++)i-=e[a*t+r]*n[a];n[r]=i/e[r*t+r]}}var Qm=(e,t)=>12*e*e*e/(t*t),$m=new Float64Array(4),eh=new Float64Array(4),th=new Float64Array(4),nh=new Float64Array(4),rh=new Float64Array(4),ih=new Float64Array(4);function ah(e,t,n,r){let i=1-e,a=e*e;t[0]=i*i*i/6,t[1]=(3*a*e-6*a+4)/6,t[2]=(-3*a*e+3*a+3*e+1)/6,t[3]=a*e/6,n[0]=-i*i/2,n[1]=(3*a-4*e)/2,n[2]=(-3*a+2*e+1)/2,n[3]=a/2,r[0]=i,r[1]=3*e-2,r[2]=1-3*e,r[3]=e}function oh(e,t,n,r){let i=(t-e.x0)/e.sx,a=(n-e.y0)/e.sy,o=Math.floor(i),s=Math.floor(a);ah(i-o,$m,eh,rh),ah(a-s,th,nh,ih);let c=0,l=0,u=0,d=0,f=0,p=0;for(let t=0;t<4;t++){let n=Math.min(e.ny-1,Math.max(0,s-1+t)),r=0,i=0,a=0;for(let t=0;t<4;t++){let s=Math.min(e.nx-1,Math.max(0,o-1+t)),c=e.data[n*e.nx+s];r+=$m[t]*c,i+=eh[t]*c,a+=rh[t]*c}c+=th[t]*r,l+=th[t]*i,u+=nh[t]*r,d+=th[t]*a,f+=nh[t]*i,p+=ih[t]*r}r[0]=c,r[1]=l/e.sx,r[2]=u/e.sy,r.length>=6&&(r[3]=d/(e.sx*e.sx),r[4]=f/(e.sx*e.sy),r[5]=p/(e.sy*e.sy))}var sh=.005/11,ch=1/(12.245*sh),lh=.9,uh=.001/11,dh=1,fh=30,ph=1e-4,mh=1e3;function hh(e,t){return 3*e*e+3*t.filter(Bm).length}function gh(e){return Math.max(1,e.weight/Math.max(1,e.on.v.length))}function _h(e,t,n){if(e>=t)return n[1]=0,n[2]=0,0;let r=e-t,i=Math.log(e/t);return n[1]=-2*r*i-r*r/e,n[2]=-2*i-4*r/e+r*r/(e*e),-r*r*i}function*vh(e,t,n,r,i,a,o,s=60){let{cols:c,hx:l,hy:u,rest:d,own:f,stretch:p}=e,m=c*c,h=3*m,g=2*c,_=3*g+2,v=_+1,y=Math.cos(e.rot),b=Math.sin(e.rot),x=e=>!f||f[e]!==0;i.length=0;for(let e=0;e<n.length;e++)i.push({h:-1/0,ax:0,ay:0,capped:!1});let S=new Int32Array(n.length).fill(-1),C=0;for(let e=0;e<n.length;e++)Bm(n[e])&&(S[e]=C++);let w=3*C,T=h+w,E=e=>h+3*S[e],D=Math.max(l,u)*(c-1),{A:O}=Um(f,c,l,u,e.bend*e.bend*e.bend),k=g+1,A=new Float64Array(h*v);for(let e=0;e<m;e++)for(let t=0;t<=g&&t<=e;t++){let n=O[e*k+t];if(n!==0)for(let r=0;r<3;r++)A[(3*e+r)*v+3*t]+=n}let j=e.anchor,M=[j];j%c>0&&M.push(j-1),j%c<c-1&&M.push(j+1),j>=c&&M.push(j-c),j+c<m&&M.push(j+c);let N=[[],[],[]],P=[[],[],[]],F=Math.min(l,u);for(let e of M){let t=d[2*e]-d[2*j],n=d[2*e+1]-d[2*j+1];N[0].push(3*e),P[0].push(1),N[1].push(3*e+1),P[1].push(1),e!==j&&(N[2].push(3*e,3*e+1),P[2].push(-n/F,t/F))}let I=(e,t)=>{let n=0,r=N[t],i=P[t];for(let t=0;t<r.length;t++){let a=r[t];n+=i[t]*(e[a]-d[2*Math.floor(a/3)+a%3])}return n},ee=0;for(let e=0;e<m;e++)x(e)&&ee++;for(let e=0;e<n.length;e++){if(S[e]<0)continue;let t=n[e];ee+=t.on.v.length+t.under.c.length+8;for(let e of t.over)S[e.load]>=0&&(ee+=e.d.length)}let te=new Int8Array(ee),L=new Int32Array(ee*6),R=new Float64Array(ee*6),z=new Float64Array(ee),B=new Uint8Array(ee),ne=new Int32Array(ee),V=new Int32Array(n.length).fill(-1),H=0,re=(e,...t)=>{te[H]=t.length/2;for(let e=0;e<t.length;e+=2)L[H*6+e/2]=t[e],R[H*6+e/2]=t[e+1];z[H]=e,H++};for(let e=0;e<m;e++)x(e)&&(B[H]=1,ne[H]=e,re(0,3*e,0,3*e+1,0,3*e+2,1));let ie=new Float64Array(ee).fill(ch),ae=new Int32Array(m).fill(-1);for(let e=0;e<H;e++)ae[ne[e]]=e;let oe=0;for(let e=0;e<n.length;e++)S[e]>=0&&(oe+=n[e].on.v.length);let se=new Int32Array(oe),ce=new Int32Array(oe),le=0;for(let e=0;e<n.length;e++){if(S[e]<0)continue;let t=n[e],r=E(e),i=ch*gh(t),a=H;for(let e=0;e<t.on.v.length;e++)ae[t.on.v[e]]>=0&&(ie[ae[t.on.v[e]]]+=i);for(let e=0;e<t.on.v.length;e++){let n=t.on.v[e];re(t.on.off[e],3*n+2,-1,r,1,r+1,t.on.x[e]-t.cx,r+2,t.on.y[e]-t.cy),se[le]=3*n+2,ce[le++]=r-h}for(let e=0;e<t.under.c.length;e++)re(t.under.c[e],r,1,r+1,t.under.x[e]-t.cx,r+2,t.under.y[e]-t.cy);for(let e of t.over){if(S[e.load]<0)continue;let i=n[e.load],a=E(e.load);for(let n=0;n<e.d.length;n++)re(e.d[n],r,1,r+1,e.x[n]-t.cx,r+2,e.y[n]-t.cy,a,-1,a+1,-(e.x[n]-i.cx),a+2,-(e.y[n]-i.cy))}ie.fill(i,a,H),V[e]=H;for(let[e,t]of om)re(-im*D,r+1,e*D,r+2,t*D)}let U=new Float64Array(T),ue=o?.last,de=!!ue&&ue.x.length===T;if(a&&(a.warm=de),de)U.set(ue.x);else{for(let e=0;e<h;e++)U[e]=r.xyz[e];for(let e=0;e<n.length;e++){if(S[e]<0||!r.planes)continue;let t=E(e);U[t]=r.planes[3*e],U[t+1]=r.planes[3*e+1],U[t+2]=r.planes[3*e+2]}}let fe=new Float64Array(6),W=new Float64Array(ee*3),pe=new Float64Array(ee),me=(e,t)=>{let n=e*6,r=-z[e];for(let i=0;i<te[e];i++)r+=R[n+i]*t[L[n+i]];return r},he=(n,r)=>{for(let i=0;i<ee;i++){if(B[i]===0){pe[i]=me(i,n);continue}let a=i*6,o=ne[i],s=n[3*o],c=n[3*o+1];oh(t,e.x+y*s-b*c,e.y+b*s+y*c,fe),pe[i]=n[3*o+2]-fe[0],r&&(R[a]=-(fe[1]*y+fe[2]*b),R[a+1]=-(-fe[1]*b+fe[2]*y),W[3*i]=y*y*fe[3]+2*y*b*fe[4]+b*b*fe[5],W[3*i+1]=-y*b*fe[3]+(y*y-b*b)*fe[4]+y*b*fe[5],W[3*i+2]=b*b*fe[3]-2*y*b*fe[4]+y*y*fe[5])}},ge=(e,t)=>{let n=1/0;for(let r=0;r<8;r++)n=Math.min(n,me(V[e]+r,t));return n},_e=sh*.001;he(U,!1);for(let e=0;e<ee;e++)B[e]===1&&pe[e]<=_e&&(U[3*ne[e]+2]+=sh/2-pe[e]);for(let e=0;e<n.length;e++){if(S[e]<0)continue;let t=E(e);for(let n=0;n<30&&ge(e,U)<=_e;n++)U[t+1]*=.9,U[t+2]*=.9;he(U,!1);let n=0;for(let e=0;e<ee;e++){let r=!1;for(let n=0;n<te[e]&&!r;n++)r=L[e*6+n]===t&&R[e*6+n]===1;r&&pe[e]<=_e&&(n=Math.max(n,sh/2-pe[e]))}U[t]+=n}let ve=c-1,ye=new Float64Array(ve*ve*4*6),be=(...e)=>p*(e.every(x)?1:Dm)/4;for(let e=0,t=0;e<ve;e++)for(let n=0;n<ve;n++){let r=e*c+n,i=r+1,a=r+c,o=a+1;for(let[e,n,s]of[[r,i,a],[i,r,o],[a,o,r],[o,a,i]])ye.set([e,n,s,be(e,n),be(e,s),be(e,n,s)],t),t+=6}let G=ye.length/6,xe=1/(l*l),Se=1/(u*u),Ce=1/(Math.SQRT2*l*u),we=new Float64Array(27),Te=new Float64Array(3),Ee=new Int32Array(9),K=new Float64Array(3),De=new Float64Array(3),q=new Float64Array(9),Oe=(e,t,n)=>{let r=0;for(let i=0;i<G;i++){let a=ye[6*i],o=ye[6*i+1],s=ye[6*i+2],c=ye[6*i+3],l=ye[6*i+4],u=ye[6*i+5];for(let t=0;t<3;t++)K[t]=e[3*o+t]-e[3*a+t],De[t]=e[3*s+t]-e[3*a+t];let d=K[0]*K[0]+K[1]*K[1]+K[2]*K[2],f=De[0]*De[0]+De[1]*De[1]+De[2]*De[2],p=K[0]*De[0]+K[1]*De[1]+K[2]*De[2],m=(d*xe-1)/2,h=(f*Se-1)/2,g=p*Ce;if(r+=(c*m*m+l*h*h+u*g*g)/2,!t)continue;Te[0]=c*m,Te[1]=l*h,Te[2]=u*g;for(let e=0;e<3;e++)Ee[e]=3*a+e,Ee[3+e]=3*o+e,Ee[6+e]=3*s+e,we[e]=-K[e]*xe,we[3+e]=K[e]*xe,we[6+e]=0,we[9+e]=-De[e]*Se,we[12+e]=0,we[15+e]=De[e]*Se,we[18+e]=-(K[e]+De[e])*Ce,we[21+e]=De[e]*Ce,we[24+e]=K[e]*Ce;for(let e=0;e<3;e++){let n=Te[e];for(let r=0;r<9;r++)t[Ee[r]]+=n*we[e*9+r]}if(!n)continue;for(let e=0;e<9;e++){let t=Ee[e];for(let r=0;r<9;r++){let i=Ee[r];if(i>t)continue;let a=c*we[e]*we[r]+l*we[9+e]*we[9+r]+u*we[18+e]*we[18+r];a!==0&&(n[t*v+(t-i)]+=a)}}let _=c*m*xe,y=l*h*Se,b=u*g*Ce;Ch(_+y+2*b,-_-b,-y-b,_,b,y,q);for(let e=0;e<3;e++){let t=e===0?a:e===1?o:s;for(let r=0;r<3;r++){let i=r===0?a:r===1?o:s,c=q[e*3+r];if(!(c===0||i>t))for(let e=0;e<3;e++)n[(3*t+e)*v+3*(t-i)]+=c}}}return r},ke=new Float64Array(h),Ae=(e,t)=>{for(let n=0;n<m;n++){let r=n*k,i=O[r]*e[3*n],a=O[r]*e[3*n+1],o=O[r]*e[3*n+2];for(let t=1;t<=g;t++){if(n-t>=0){let s=O[r+t];if(s!==0){let r=3*(n-t);i+=s*e[r],a+=s*e[r+1],o+=s*e[r+2]}}if(n+t<m){let r=O[(n+t)*k+t];if(r!==0){let s=3*(n+t);i+=r*e[s],a+=r*e[s+1],o+=r*e[s+2]}}}t[3*n]=i,t[3*n+1]=a,t[3*n+2]=o}},je=new Float64Array(3),Me=new Float64Array(3),Ne=e=>{he(e,!1);let t=0;for(let e=0;e<ee;e++){let n=pe[e];if(!(n>0))return 1/0;n<sh&&(t+=ie[e]*_h(n,sh,je))}Ae(e,ke);for(let n=0;n<h;n++)t+=.5*e[n]*ke[n];for(let n=0;n<m;n++)x(n)&&(t+=e[3*n+2]);for(let r=0;r<n.length;r++)S[r]>=0&&(t+=n[r].weight*e[E(r)]);for(let n=0;n<3;n++)t+=qe/2*I(e,n)**2;return t+Oe(e,null,null)},Pe=new Float64Array(T),Fe=new Float64Array(T),Ie=new Float64Array(T),Le=new Float64Array(h*v),Re=new Float64Array(h*v),ze=new Float64Array(h*w),Be=new Float64Array(w*h),Ve=new Int32Array(w),He=new Float64Array(w*w),Ue=new Float64Array(w*w),We=new Float64Array(h),Ge=new Float64Array(T),Ke=qm(h,_,w,se,ce,le),J=0;for(let e=0;e<h;e++)J=Math.max(J,A[e*v]);J=Math.max(J,p*Math.max(xe,Se));let qe=mh*J,Je=Ne(U),Ye=new Uint8Array(T);for(let e=0;e<T;e++)Ye[e]=e>=h||x(Math.floor(e/3))?1:0;let Xe=0,Ze=!1,Qe=0,$e=dh*D;for(;Xe<s;){he(U,!0),Le.set(A),ze.fill(0),He.fill(0),Ae(U,Pe);for(let e=0;e<m;e++)x(e)&&(Pe[3*e+2]+=1);for(let e=0;e<n.length;e++){if(S[e]<0)continue;let t=E(e);Pe[t]=n[e].weight,Pe[t+1]=0,Pe[t+2]=0}Oe(U,Pe,Le);for(let e=0;e<3;e++){let t=qe*I(U,e),n=N[e],r=P[e];for(let e=0;e<n.length;e++){Pe[n[e]]+=t*r[e];for(let t=0;t<n.length;t++){let i=n[e],a=n[t];a<=i&&(Le[i*v+(i-a)]+=qe*r[e]*r[t])}}}for(let e=0;e<ee;e++){let t=pe[e];if(t>=sh)continue;_h(t,sh,je);let n=ie[e]*je[1],r=ie[e]*je[2],i=te[e],a=e*6;for(let e=0;e<i;e++){let t=L[a+e],o=R[a+e];if(o!==0){Pe[t]+=n*o;for(let e=0;e<i;e++){let n=L[a+e],i=r*o*R[a+e];i!==0&&(t<h?n<h?n<=t&&(Le[t*v+(t-n)]+=i):ze[t*w+(n-h)]+=i:n>=h&&(He[(t-h)*w+(n-h)]+=i))}}}if(B[e]===1){let t=ne[e];yh(-n*W[3*e],-n*W[3*e+1],-n*W[3*e+2],Me),Le[3*t*v]+=Me[0],Le[(3*t+1)*v+1]+=Me[1],Le[(3*t+1)*v]+=Me[2]}}Re.set(Le),Qe=Qe>0?Qe/10:0,Qe<1e-9*J&&(Qe=0);let e=!1;for(;;){if(Qe>0){Le.set(Re);for(let e=0;e<h;e++)Le[e*v]+=Qe}if(Km(Le,h,_,!0)){for(let e=0;e<w;e++){let t=h;for(let n=0;n<h&&t===h;n++)ze[n*w+e]!==0&&(t=n);Ve[e]=t;for(let n=t;n<h;n++)We[n]=ze[n*w+e];Jm(Le,h,_,We,t),Be.set(We.subarray(t,h),e*h+t)}Ue.set(He);for(let e=0;e<w;e++){Ue[e*w+e]+=Qe>0?Qe:1e-12*J;for(let t=0;t<=e;t++){let n=0;for(let r=Math.max(Ve[e],Ve[t]);r<h;r++)n+=Be[e*h+r]*Be[t*h+r];Ue[e*w+t]-=n}}if(Xm(Ue,w,!0))break}if(Qe=Qe>0?Qe*10:1e-6*J,!(Qe<=0xe8d4a51000*J)){e=!0;break}}if(e)break;for(let e=0;e<T;e++)Fe[e]=-Pe[e];Ke(Le,ze,Ue,Fe,Ie);let t=0;for(let e=0;e<T;e++)Ye[e]&&(t=Math.max(t,Math.abs(Ie[e])));if(t<=uh){Ze=!0;break}let r=0;for(let e=0;e<T;e++)r+=Pe[e]*Ie[e];let i=1e-12*Math.abs(Je),a=Math.min(1,$e/t),s=a;for(let e=0;e<ee;e++){if(B[e]!==0)continue;let t=e*6,n=0;for(let r=0;r<te[e];r++)n+=R[t+r]*Ie[L[t+r]];n<0&&(s=Math.min(s,lh*me(e,U)/-n))}let c=1/0,l=0;for(;l<fh;l++,s/=2){for(let e=0;e<T;e++)Ge[e]=U[e]+s*Ie[e];if(c=Ne(Ge),c<=Je+ph*s*r+i)break}if(Xe++,l===fh)break;let u=0;for(let e=0;e<T;e++)Ye[e]&&(u=Math.max(u,Math.abs(Ge[e]-U[e])));if(U.set(Ge),Je=c,u<=uh&&s===a){Ze=!0;break}o&&(o.last={x:U.slice()}),yield}if(a&&(a.rounds=Xe,a.converged=Ze),o&&(o.last={x:U.slice()}),f){let e=new Float64Array(m*k);e.set(O);for(let t=0;t<m;t++)if(!x(t))e[t*k]+=1e-9*J;else{for(let n=1;n<=g;n++)t-n>=0&&(e[t*k+n]=0),t+n<m&&(e[(t+n)*k+n]=0);e[t*k]=1}if(Km(e,m,g,!0)){Ae(U,ke);let t=new Float64Array(m);for(let n=0;n<3;n++){for(let e=0;e<m;e++)t[e]=x(e)?0:-ke[3*e+n];Ym(e,m,g,t);for(let e=0;e<m;e++)x(e)||(U[3*e+n]+=t[e])}}}let et=U.slice(0,h);for(let e=0;e<n.length;e++){if(S[e]<0)continue;let t=E(e),n=i[e];n.h=U[t],n.ax=U[t+1],n.ay=U[t+2],n.capped=ge(e,U)<sh}return et}function yh(e,t,n,r){let i=(e+n)/2,a=Math.hypot((e-n)/2,t),o=i+a;if(i-a>=0){r[0]=e,r[1]=t,r[2]=n;return}if(o<=0){r[0]=r[1]=r[2]=0;return}let s=t,c=o-e;Math.abs(s)+Math.abs(c)<1e-300&&(s=o-n,c=t);let l=Math.hypot(s,c);s/=l,c/=l,r[0]=o*s*s,r[1]=o*s*c,r[2]=o*c*c}var bh=[1/Math.SQRT2,-1/Math.SQRT2,0],xh=[1/Math.sqrt(6),1/Math.sqrt(6),-2/Math.sqrt(6)],Sh=new Float64Array(3);function Ch(e,t,n,r,i,a,o){yh((e-2*t+r)/2,(e-r-2*n+2*i)/Math.sqrt(12),(e+r+4*a+2*t-4*n-4*i)/6,Sh);for(let e=0;e<3;e++)for(let t=0;t<3;t++)o[e*3+t]=Sh[0]*bh[e]*bh[t]+Sh[1]*(bh[e]*xh[t]+xh[e]*bh[t])+Sh[2]*xh[e]*xh[t]}var wh=.1/11,Th=1/(12.245*wh),Eh=1e-8*wh,Dh=wh/10,Oh=Dh/4,kh=3,Ah=1.25,jh=14,Mh=.001/11,Nh=2,Ph=.1/11,Fh=.1,Ih=200,Lh=4,Rh=1e-4,zh=40,Bh=1e3,Vh=5,Hh=.9,Uh=25,Wh=6;function Gh(e,t,n){if(e>=t)return n[1]=0,n[2]=0,0;let r=e-t,i=Math.log(e/t);return n[1]=-2*r*i-r*r/e,n[2]=-2*i-4*r/e+r*r/(e*e),-r*r*i}function Kh(e,t,n,r){let i=(e+n)/2,a=Math.hypot((e-n)/2,t),o=i+a;if(i-a>=0){r[0]=e,r[1]=t,r[2]=n;return}if(o<=0){r[0]=r[1]=r[2]=0;return}let s=t,c=o-e;Math.abs(s)+Math.abs(c)<1e-300&&(s=o-n,c=t);let l=Math.hypot(s,c);s/=l,c/=l,r[0]=o*s*s,r[1]=o*s*c,r[2]=o*c*c}var qh=[1/Math.SQRT2,-1/Math.SQRT2,0],Jh=[1/Math.sqrt(6),1/Math.sqrt(6),-2/Math.sqrt(6)],Yh=new Float64Array(3);function Xh(e,t,n,r,i,a,o){Kh((e-2*t+r)/2,(e-r-2*n+2*i)/Math.sqrt(12),(e+r+4*a+2*t-4*n-4*i)/6,Yh);for(let e=0;e<3;e++)for(let t=0;t<3;t++)o[e*3+t]=Yh[0]*qh[e]*qh[t]+Yh[1]*(qh[e]*Jh[t]+Jh[e]*qh[t])+Yh[2]*Jh[e]*Jh[t]}function Zh(e,t,n){let r=Math.floor(n/e)-Math.floor(t/e),i=n%e-t%e;return r<-2||r>2||i<-2||i>2?-1:(r+2)*5+i+2}var Qh=class{n;cols;act;H;list;nb;start=new Int32Array;ps=new Int32Array;pj=new Int32Array;P=new Float64Array;diag=new Int32Array;constructor(e,t){this.cols=e,this.act=t,this.n=e*e,this.H=new Float64Array(this.n*Uh*9);let n=[];for(let e=0;e<this.n;e++)t[e]&&n.push(e);this.list=Int32Array.from(n),this.nb=new Int32Array(n.length*Uh).fill(-1),n.forEach((n,r)=>{let i=Math.floor(n/e),a=n%e;for(let n=0;n<Uh;n++){let o=i+Math.floor(n/5)-2,s=a+n%5-2;if(o<0||s<0||o>=e||s>=e)continue;let c=o*e+s;t[c]&&(this.nb[r*Uh+n]=c)}})}pattern(e){let t=this.list.length;this.start=new Int32Array(t+1),this.diag=new Int32Array(t).fill(-1);let n=[],r=[];for(let i=0;i<t;i++){this.start[i]=n.length;for(let t=0;t<Uh;t++){let a=this.nb[i*Uh+t];a<0||!e(i,t)||(t===12&&(this.diag[i]=n.length),n.push(t),r.push(a))}}this.start[t]=n.length,this.ps=Int32Array.from(n),this.pj=Int32Array.from(r),this.P=new Float64Array(n.length*9)}pack(){let{H:e,P:t,list:n,start:r,ps:i}=this;for(let a=0;a<n.length;a++){let o=n[a]*Uh;for(let n=r[a],s=r[a+1];n<s;n++){let r=(o+i[n])*9,a=n*9;for(let n=0;n<9;n++)t[a+n]=e[r+n]}}}clear(){let{H:e,list:t,start:n,ps:r}=this;for(let i=0;i<t.length;i++){let a=t[i]*Uh;for(let t=n[i],o=n[i+1];t<o;t++)e.fill(0,(a+r[t])*9,(a+r[t])*9+9)}}mul(e,t){let{P:n,list:r,start:i,pj:a}=this;for(let o=0;o<r.length;o++){let s=r[o],c=0,l=0,u=0;for(let t=i[o],r=i[o+1];t<r;t++){let r=a[t],i=t*9,o=e[3*r],s=e[3*r+1],d=e[3*r+2];c+=n[i]*o+n[i+1]*s+n[i+2]*d,l+=n[i+3]*o+n[i+4]*s+n[i+5]*d,u+=n[i+6]*o+n[i+7]*s+n[i+8]*d}t[3*s]=c,t[3*s+1]=l,t[3*s+2]=u}}};function $h(e){let t=(e+1)/2,n=e*e,r=new Int32Array(n*4),i=new Float64Array(n*4),a=new Uint8Array(n);for(let n=0;n<e;n++)for(let o=0;o<e;o++){let s=n*e+o,c=n%2?[(n-1)/2,(n+1)/2]:[n/2],l=o%2?[(o-1)/2,(o+1)/2]:[o/2],u=0;for(let e of c)for(let n of l)r[s*4+u]=e*t+n,i[s*4+u]=1/(c.length*l.length),u++;a[s]=u}return{idx:r,w:i,cnt:a}}function eg(e,t,n,r,i){let a=e[t]+i,o=e[t+1],s=e[t+2],c=e[t+3],l=e[t+4]+i,u=e[t+5],d=e[t+6],f=e[t+7],p=e[t+8]+i,m=l*p-u*f,h=-(c*p-u*d),g=c*f-l*d,_=1/(a*m+o*h+s*g);n[r]=m*_,n[r+1]=-(o*p-s*f)*_,n[r+2]=(o*u-s*l)*_,n[r+3]=h*_,n[r+4]=(a*p-s*d)*_,n[r+5]=-(a*u-s*c)*_,n[r+6]=g*_,n[r+7]=-(a*f-o*d)*_,n[r+8]=(a*l-o*c)*_}var tg=class{levels=[];coarse=new Float64Array;coarseN=0;constructor(e){e.pattern((e,t)=>{let n=Math.abs(Math.floor(t/5)-2),r=Math.abs(t%5-2);return n<=1&&r<=1||n===2&&r===0||n===0&&r===2});let t=e;for(;;){let e=t.cols,n=e*e,r=e>Vh?$h(e):null;if(this.levels.push({A:t,Dinv:new Float64Array(n*9),par:r,r:new Float64Array(3*n),e:new Float64Array(3*n),t:new Float64Array(3*n),cslot:null}),!r)break;let i=(e+1)/2,a=new Uint8Array(i*i);for(let e of t.list)for(let t=0;t<r.cnt[e];t++)a[r.idx[e*4+t]]=1;t=new Qh(i,a)}for(let e=0;e+1<this.levels.length;e++){let t=this.levels[e],n=t.A,r=this.levels[e+1].A,i=t.par,a=new Int32Array(n.ps.length*16).fill(-1),o=new Uint8Array(r.n*Uh);for(let e=0;e<n.list.length;e++){let t=n.list[e];for(let s=n.start[e];s<n.start[e+1];s++){let e=n.pj[s];for(let n=0;n<i.cnt[t];n++)for(let c=0;c<i.cnt[e];c++){let l=i.idx[t*4+n],u=Zh(r.cols,l,i.idx[e*4+c]);a[(s*4+n)*4+c]=l*Uh+u,o[l*Uh+u]=1}}}r.pattern((e,t)=>o[r.list[e]*Uh+t]===1);let s=new Int32Array(r.n*Uh).fill(-1);for(let e=0;e<r.list.length;e++)for(let t=r.start[e];t<r.start[e+1];t++)s[r.list[e]*Uh+r.ps[t]]=t*9;for(let e=0;e<a.length;e++)a[e]>=0&&(a[e]=s[a[e]]);t.cslot=a}}setup(e){this.levels[0].A.pack();for(let e=0;e+1<this.levels.length;e++){let t=this.levels[e],n=t.A,r=this.levels[e+1].A,i=t.par,a=t.cslot,o=r.P,s=n.P,{list:c,start:l,pj:u}=n,{cnt:d,w:f}=i;o.fill(0);for(let e=0;e<c.length;e++){let t=c[e],n=d[t];for(let r=l[e],i=l[e+1];r<i;r++){let e=u[r],i=d[e],c=r*9,l=s[c],p=s[c+1],m=s[c+2],h=s[c+3],g=s[c+4],_=s[c+5],v=s[c+6],y=s[c+7],b=s[c+8];for(let s=0;s<n;s++){let n=f[t*4+s];for(let t=0;t<i;t++){let i=n*f[e*4+t],c=a[(r*4+s)*4+t];o[c]+=i*l,o[c+1]+=i*p,o[c+2]+=i*m,o[c+3]+=i*h,o[c+4]+=i*g,o[c+5]+=i*_,o[c+6]+=i*v,o[c+7]+=i*y,o[c+8]+=i*b}}}}}for(let t of this.levels){let n=t.A;for(let r=0;r<n.list.length;r++)eg(n.P,n.diag[r]*9,t.Dinv,n.list[r]*9,e)}let t=this.levels[this.levels.length-1].A,n=3*t.n;this.coarseN=n;let r=new Float64Array(n*n);for(let e=0;e<t.n;e++)if(!t.act[e])for(let t=0;t<3;t++)r[(3*e+t)*n+3*e+t]=1;for(let e=0;e<t.list.length;e++){let i=t.list[e];for(let a=t.start[e];a<t.start[e+1];a++){let e=t.pj[a];for(let o=0;o<3;o++)for(let s=0;s<3;s++)r[(3*i+o)*n+3*e+s]=t.P[a*9+o*3+s]}}for(let t=0;t<n;t++)r[t*n+t]+=e;for(let t=0;t<n;t++)for(let i=0;i<=t;i++){let a=r[t*n+i];for(let e=0;e<i;e++)a-=r[t*n+e]*r[i*n+e];r[t*n+i]=i===t?Math.sqrt(Math.max(a,e)):a/r[i*n+i]}this.coarse=r}smooth(e,t,n,r){let{P:i,list:a,start:o,pj:s,diag:c}=e.A,l=e.Dinv,u=a.length;for(let e=0;e<u;e++){let d=r?e:u-1-e,f=a[d],p=t[3*f],m=t[3*f+1],h=t[3*f+2],g=c[d];for(let e=o[d],t=o[d+1];e<t;e++){if(e===g)continue;let t=s[e],r=e*9,a=n[3*t],o=n[3*t+1],c=n[3*t+2];p-=i[r]*a+i[r+1]*o+i[r+2]*c,m-=i[r+3]*a+i[r+4]*o+i[r+5]*c,h-=i[r+6]*a+i[r+7]*o+i[r+8]*c}let _=f*9;n[3*f]=l[_]*p+l[_+1]*m+l[_+2]*h,n[3*f+1]=l[_+3]*p+l[_+4]*m+l[_+5]*h,n[3*f+2]=l[_+6]*p+l[_+7]*m+l[_+8]*h}}cycle(e,t,n){let r=this.levels[e];if(e===this.levels.length-1){let e=this.coarseN,r=this.coarse;for(let i=0;i<e;i++){let a=t[i];for(let t=0;t<i;t++)a-=r[i*e+t]*n[t];n[i]=a/r[i*e+i]}for(let t=e-1;t>=0;t--){let i=n[t];for(let a=t+1;a<e;a++)i-=r[a*e+t]*n[a];n[t]=i/r[t*e+t]}return}n.fill(0),this.smooth(r,t,n,!0),r.A.mul(n,r.t);let i=this.levels[e+1],{cnt:a,idx:o,w:s}=r.par,c=r.A.list,l=r.t,u=i.r,d=i.e;u.fill(0);for(let e=0;e<c.length;e++){let n=c[e],r=t[3*n]-l[3*n],i=t[3*n+1]-l[3*n+1],d=t[3*n+2]-l[3*n+2];for(let e=0;e<a[n];e++){let t=o[n*4+e],a=s[n*4+e];u[3*t]+=a*r,u[3*t+1]+=a*i,u[3*t+2]+=a*d}}this.cycle(e+1,u,d);for(let e=0;e<c.length;e++){let t=c[e],r=n[3*t],i=n[3*t+1],l=n[3*t+2];for(let e=0;e<a[t];e++){let n=o[t*4+e],a=s[t*4+e];r+=a*d[3*n],i+=a*d[3*n+1],l+=a*d[3*n+2]}n[3*t]=r,n[3*t+1]=i,n[3*t+2]=l}this.smooth(r,t,n,!1)}apply(e,t){this.cycle(0,e,t)}};function*ng(e,t,n,r,i,a,o=200,s=10){let{cols:c,hx:l,hy:u,rest:d,own:f}=e,p=c*c,m=3*p,h=c-1,g=Math.cos(e.rot),_=Math.sin(e.rot),v=e=>!f||f[e]!==0,y=Math.max(l,u)*h;i.length=0;for(let e=0;e<n.length;e++)i.push({h:-1/0,ax:0,ay:0,capped:!1});let b=new Uint8Array(p);for(let e=0;e<p;e++){if(!v(e))continue;let t=Math.floor(e/c),n=e%c;for(let e=-2;e<=Nh;e++)for(let r=-2;r<=Nh;r++){let i=t+e,a=n+r;i>=0&&a>=0&&i<c&&a<c&&(b[i*c+a]=1)}}let x=new Qh(c,b),S=x.list,C=Int32Array.from(Array.from(S).filter(e=>v(e))),w=new Int32Array(n.length).fill(-1),T=0;for(let e=0;e<n.length;e++)Bm(n[e])&&(w[e]=T++);let E=3*T,D=m+E,O=e=>m+3*w[e],k=e.bend*e.bend*e.bend,A=new Float64Array(p*Uh),j=0;{let e=(e,t,n)=>{for(let t of e)if(!b[t])return;let r=e.every(v)?n*k:n*k*Dm;for(let n=0;n<e.length;n++)for(let i=0;i<e.length;i++)A[e[n]*Uh+Zh(c,e[n],e[i])]+=r*t[n]*t[i]},t=1/(l*l),n=1/(u*u),r=1/(l*u);for(let i=0;i<c;i++)for(let a=0;a<c;a++){let o=i*c+a;a>0&&a<c-1&&e([o-1,o,o+1],[t,-2*t,t],1),i>0&&i<c-1&&e([o-c,o,o+c],[n,-2*n,n],1),a<c-1&&i<c-1&&e([o,o+1,o+c,o+c+1],[r,-r,-r,r],2)}for(let e of S)j=Math.max(j,A[e*Uh+12])}let M=(e,t)=>{for(let n=0;n<S.length;n++){let r=S[n],i=0,a=0,o=0;for(let t=0;t<Uh;t++){let s=x.nb[n*Uh+t];if(s<0)continue;let c=A[r*Uh+t];c!==0&&(i+=c*e[3*s],a+=c*e[3*s+1],o+=c*e[3*s+2])}t[3*r]=i,t[3*r+1]=a,t[3*r+2]=o}};j=Math.max(j,e.stretch/(l*l),e.stretch/(u*u));let N=1e-10*j,P=e.anchor,F=[P];P%c>0&&F.push(P-1),P%c<h&&F.push(P+1),P>=c&&F.push(P-c),P+c<p&&F.push(P+c);let I=[[],[],[]],ee=[[],[],[]],te=Math.min(l,u);for(let e of F){if(!b[e])continue;let t=d[2*e]-d[2*P],n=d[2*e+1]-d[2*P+1];I[0].push(3*e),ee[0].push(1),I[1].push(3*e+1),ee[1].push(1),e!==P&&(I[2].push(3*e,3*e+1),ee[2].push(-n/te,t/te))}let L=Bh*j,R=new Set;for(let e=0;e<n.length;e++){if(w[e]<0)continue;let t=n[e].on.v;for(let e=0;e<t.length;e++)b[t[e]]&&R.add(t[e])}let z=Int32Array.from(R),B=[];for(let e=0;e<n.length;e++){if(w[e]<0)continue;let t=n[e].on.v,r=new Set;for(let e=0;e<t.length;e++)b[t[e]]&&r.add(3*t[e]+2);B[w[e]]=Int32Array.from(r).sort()}let ne=Float64Array.from(z,e=>r.xyz[3*e]),V=Float64Array.from(z,e=>r.xyz[3*e+1]),H=s*j,re=(e,t)=>{let n=0,r=I[t],i=ee[t];for(let t=0;t<r.length;t++){let a=r[t];n+=i[t]*(e[a]-d[2*Math.floor(a/3)+a%3])}return n},ie=[],ae=[],oe=(...t)=>e.stretch*(t.every(v)?1:Dm)/4;for(let e=0;e<h;e++)for(let t=0;t<h;t++){let n=e*c+t,r=n+1,i=n+c,a=i+1;for(let[e,t,o]of[[n,r,i],[r,n,a],[i,a,n],[a,i,r]])b[e]&&b[t]&&b[o]&&(ie.push(e,t,o),ae.push(oe(e,t),oe(e,o),oe(e,t,o)))}let se=ie.length/3,ce=Int32Array.from(ie),le=Float64Array.from(ae),U=new Int32Array(se*9);for(let e=0;e<se;e++)for(let t=0;t<3;t++)for(let n=0;n<3;n++)U[e*9+t*3+n]=(ce[3*e+t]*Uh+Zh(c,ce[3*e+t],ce[3*e+n]))*9;let ue=1/(l*l),de=1/(u*u),fe=1/(Math.SQRT2*l*u),W=new Float64Array(27),pe=new Float64Array(9),me=new Float64Array(3),he=new Float64Array(3),ge=!1,_e=(e,t,n)=>{let r=0;for(let i=0;i<se;i++){let a=ce[3*i],o=ce[3*i+1],s=ce[3*i+2],c=le[3*i],l=le[3*i+1],u=le[3*i+2];for(let t=0;t<3;t++)me[t]=e[3*o+t]-e[3*a+t],he[t]=e[3*s+t]-e[3*a+t];let d=((me[0]*me[0]+me[1]*me[1]+me[2]*me[2])*ue-1)/2,f=((he[0]*he[0]+he[1]*he[1]+he[2]*he[2])*de-1)/2,p=(me[0]*he[0]+me[1]*he[1]+me[2]*he[2])*fe;if(r+=(c*d*d+l*f*f+u*p*p)/2,!t)continue;for(let e=0;e<3;e++)W[e]=-me[e]*ue,W[3+e]=me[e]*ue,W[6+e]=0,W[9+e]=-he[e]*de,W[12+e]=0,W[15+e]=he[e]*de,W[18+e]=-(me[e]+he[e])*fe,W[21+e]=he[e]*fe,W[24+e]=me[e]*fe;let m=c*d,h=l*f,g=u*p;for(let e=0;e<3;e++)t[3*a+e]+=m*W[e]+h*W[9+e]+g*W[18+e],t[3*o+e]+=m*W[3+e]+h*W[12+e]+g*W[21+e],t[3*s+e]+=m*W[6+e]+h*W[15+e]+g*W[24+e];if(!n)continue;for(let e=0;e<3;e++){let t=W[e*3],r=W[e*3+1],a=W[e*3+2],o=W[9+e*3],s=W[9+e*3+1],d=W[9+e*3+2],f=W[18+e*3],p=W[18+e*3+1],m=W[18+e*3+2];for(let h=0;h<3;h++){let g=U[i*9+e*3+h],_=W[h*3],v=W[h*3+1],y=W[h*3+2],b=W[9+h*3],x=W[9+h*3+1],S=W[9+h*3+2],C=W[18+h*3],w=W[18+h*3+1],T=W[18+h*3+2];n[g]+=c*t*_+l*o*b+u*f*C,n[g+1]+=c*t*v+l*o*x+u*f*w,n[g+2]+=c*t*y+l*o*S+u*f*T,n[g+3]+=c*r*_+l*s*b+u*p*C,n[g+4]+=c*r*v+l*s*x+u*p*w,n[g+5]+=c*r*y+l*s*S+u*p*T,n[g+6]+=c*a*_+l*d*b+u*m*C,n[g+7]+=c*a*v+l*d*x+u*m*w,n[g+8]+=c*a*y+l*d*S+u*m*T}}let _=c*d*ue,v=l*f*de,y=u*p*fe;ge?(pe[0]=_+v+2*y,pe[1]=pe[3]=-_-y,pe[2]=pe[6]=-v-y,pe[4]=_,pe[5]=pe[7]=y,pe[8]=v):Xh(_+v+2*y,-_-y,-v-y,_,y,v,pe);for(let e=0;e<3;e++)for(let t=0;t<3;t++){let r=pe[e*3+t];if(r===0)continue;let a=U[i*9+e*3+t];n[a]+=r,n[a+4]+=r,n[a+8]+=r}}return r},ve=0;for(let e=0;e<n.length;e++){if(w[e]<0)continue;let t=n[e];ve+=t.on.v.length+t.under.c.length+8;for(let e of t.over)w[e.load]>=0&&(ve+=e.d.length)}let ye=new Int8Array(ve),be=new Int32Array(ve*Wh),G=new Float64Array(ve*Wh),xe=new Float64Array(ve),Se=new Int32Array(n.length).fill(-1),Ce=0,we=(e,...t)=>{ye[Ce]=t.length/2;for(let e=0;e<t.length;e+=2)be[Ce*Wh+e/2]=t[e],G[Ce*Wh+e/2]=t[e+1];xe[Ce]=e,Ce++};for(let e=0;e<n.length;e++){if(w[e]<0)continue;let t=n[e],r=O(e);for(let e=0;e<t.on.v.length;e++)we(t.on.off[e],3*t.on.v[e]+2,-1,r,1,r+1,t.on.x[e]-t.cx,r+2,t.on.y[e]-t.cy);for(let e=0;e<t.under.c.length;e++)we(t.under.c[e],r,1,r+1,t.under.x[e]-t.cx,r+2,t.under.y[e]-t.cy);for(let e of t.over){if(w[e.load]<0)continue;let i=n[e.load],a=O(e.load);for(let n=0;n<e.d.length;n++)we(e.d[n],r,1,r+1,e.x[n]-t.cx,r+2,e.y[n]-t.cy,a,-1,a+1,-(e.x[n]-i.cx),a+2,-(e.y[n]-i.cy))}Se[e]=Ce;for(let[e,t]of om)we(-im*y,r+1,e*y,r+2,t*y)}let Te=new Float64Array(ve).fill(Th),Ee=new Float64Array(p).fill(Th);{let e=0;for(let t=0;t<n.length;t++){if(w[t]<0)continue;let r=n[t],i=Th*gh(r),a=r.on.v.length+r.under.c.length;for(let e of r.over)w[e.load]>=0&&(a+=e.d.length);Te.fill(i,e,e+a),e+=a+om.length;for(let e=0;e<r.on.v.length;e++)Ee[r.on.v[e]]+=i}}let K=(e,t)=>{let n=e*Wh,r=-xe[e];for(let i=0;i<ye[e];i++)r+=G[n+i]*t[be[n+i]];return r},De=(e,t)=>{let n=1/0;for(let r=0;r<8;r++)n=Math.min(n,K(Se[e]+r,t));return n},q=new Float64Array(6),Oe=q.subarray(0,3),ke=(n,r,i)=>{let a=n[3*r],o=n[3*r+1];return oh(t,e.x+g*a-_*o,e.y+_*a+g*o,i),n[3*r+2]-i[0]},Ae=new Float64Array(D);for(let e=0;e<m;e++)Ae[e]=r.xyz[e];for(let e=0;e<n.length;e++){if(w[e]<0)continue;let t=O(e);Ae[t]=r.planes[3*e],Ae[t+1]=r.planes[3*e+1],Ae[t+2]=r.planes[3*e+2]}let je=r.rested?Oh:wh/2,Me=r.rested?Dh:wh/2;for(let e of C){let t=ke(Ae,e,Oe);t<je&&(Ae[3*e+2]+=Me-t)}let Ne=new Uint8Array(p),Pe=[],Fe=new Float64Array(p),Ie=r.pins??[];for(let e=0;e<Ie.length;e++){let t=Ie[e];if(!b[t]||!v(t)||Ne[t])continue;Ne[t]=1,Pe.push(t);let n=ke(Ae,t,Oe);Fe[t]=Ae[3*t+2]-n+Math.max(Ph,n+wh/2)}let Le=e=>{for(let t of Pe)e[3*t]=e[3*t+1]=0},Re=wh*.001;for(let e=0;e<n.length;e++){if(w[e]<0)continue;let t=O(e);for(let n=0;n<30&&De(e,Ae)<=(r.rested?Eh:Re);n++)Ae[t+1]*=.9,Ae[t+2]*=.9;let n=0;for(let e=0;e<ve;e++){let i=!1;for(let n=0;n<ye[e]&&!i;n++)i=be[e*Wh+n]===t&&G[e*Wh+n]===1;if(!i)continue;let a=K(e,Ae);a<=(r.rested?Oh:Re)&&(n=Math.max(n,Me-a))}Ae[t]+=n}let ze=new Float64Array(3),Be=new Float64Array(m),Ve=e=>{let t=0;for(let n of C){let r=ke(e,n,Oe);if(!(r>0))return 1/0;r<wh&&(t+=Ee[n]*Gh(r,wh,ze)),t+=e[3*n+2]}for(let n of Pe){let r=Fe[n]-e[3*n+2];if(!(r>0))return 1/0;r<wh&&(t+=Th*Gh(r,wh,ze))}for(let n=0;n<ve;n++){let r=K(n,e);if(!(r>0))return 1/0;r<wh&&(t+=Te[n]*Gh(r,wh,ze))}M(e,Be);for(let n of S)for(let r=0;r<3;r++)t+=.5*e[3*n+r]*Be[3*n+r];for(let r=0;r<n.length;r++)w[r]>=0&&(t+=n[r].weight*e[O(r)]);for(let n=0;n<3;n++)t+=L/2*re(e,n)**2;for(let n=0;n<z.length;n++){let r=z[n];t+=H/2*((e[3*r]-ne[n])**2+(e[3*r+1]-V[n])**2)}return t+_e(e,null,null)},He=x.H,Ue=new tg(x),We=new Float64Array(E*m),Ge=new Float64Array(E*E),Ke=new Float64Array(E*m),J=new Float64Array(E*E),qe=new Float64Array(D),Je=new Float64Array(D),Ye=new Float64Array(D),Xe=new Float64Array(D),Ze=new Float64Array(D),Qe=new Float64Array(D),$e=new Float64Array(D),et=new Float64Array(m),tt=new Float64Array(E),nt=new Float64Array(p),rt=new Float64Array(3),it=(e,t)=>{x.mul(e,t);for(let n=0;n<E;n++){let r=e[m+n],i=0,a=n*m,o=B[Math.floor(n/3)];for(let n=0;n<o.length;n++){let s=o[n],c=We[a+s];c!==0&&(t[s]+=c*r,i+=c*e[s])}for(let t=0;t<E;t++)i+=Ge[n*E+t]*e[m+t];t[m+n]=i}},at=(e,t)=>{if(Ue.apply(e,t),Le(t),E!==0){for(let t=0;t<E;t++){let n=e[m+t],r=t*m;for(let t of S)for(let i=0;i<3;i++)n-=Ke[r+3*t+i]*e[3*t+i];tt[t]=n}Zm(J,E,tt);for(let e=0;e<E;e++){t[m+e]=tt[e];let n=tt[e],r=e*m;for(let e of S)for(let i=0;i<3;i++)t[3*e+i]-=Ke[r+3*e+i]*n}}},ot=(e,t)=>{let n=0;for(let r of S)n+=e[3*r]*t[3*r]+e[3*r+1]*t[3*r+1]+e[3*r+2]*t[3*r+2];for(let r=m;r<D;r++)n+=e[r]*t[r];return n},st=Ve(Ae),ct=0,lt=!1,ut=0,dt=!1,ft=y,pt={assemble:0,mg:0,schur:0,cg:0,line:0},mt=0,ht=0,gt=-1,_t=0;for(;ct<o&&Number.isFinite(st);){ct>0&&(yield),ge=dt,ge&&ht++;let e=performance.now();x.clear();for(let e of S)for(let t=0;t<Uh;t++){let n=A[e*Uh+t];if(n===0)continue;let r=(e*Uh+t)*9;He[r]=He[r+4]=He[r+8]=n}qe.fill(0),We.fill(0),Ge.fill(0),M(Ae,qe);for(let e of C)qe[3*e+2]+=1;for(let e=0;e<n.length;e++)w[e]>=0&&(qe[O(e)]=n[e].weight);_e(Ae,qe,He);for(let e=0;e<3;e++){let t=L*re(Ae,e),n=I[e],r=ee[e];for(let e=0;e<n.length;e++){qe[n[e]]+=t*r[e];for(let t=0;t<n.length;t++){let i=Math.floor(n[e]/3),a=Math.floor(n[t]/3);He[(i*Uh+Zh(c,i,a))*9+n[e]%3*3+n[t]%3]+=L*r[e]*r[t]}}}for(let e=0;e<z.length;e++){let t=z[e];qe[3*t]+=H*(Ae[3*t]-ne[e]),qe[3*t+1]+=H*(Ae[3*t+1]-V[e]);let n=(t*Uh+Zh(c,t,t))*9;He[n]+=H,He[n+4]+=H}for(let e of C){let t=ke(Ae,e,q);if(nt[e]=t,t>=wh)continue;let n=-(q[1]*g+q[2]*_),r=-(-q[1]*_+q[2]*g);Gh(t,wh,ze);let i=Ee[e]*ze[1],a=Ee[e]*ze[2],o=(e*Uh+12)*9,s=[n,r,1];for(let t=0;t<3;t++){qe[3*e+t]+=i*s[t];for(let e=0;e<3;e++)He[o+t*3+e]+=a*s[t]*s[e]}let c=g*g*q[3]+2*g*_*q[4]+_*_*q[5],l=-g*_*q[3]+(g*g-_*_)*q[4]+g*_*q[5],u=_*_*q[3]-2*g*_*q[4]+g*g*q[5];ge?(rt[0]=-i*c,rt[1]=-i*l,rt[2]=-i*u):Kh(-i*c,-i*l,-i*u,rt),He[o]+=rt[0],He[o+1]+=rt[1],He[o+3]+=rt[1],He[o+4]+=rt[2]}for(let e=0;e<ve;e++){let t=K(e,Ae);if(t>=wh)continue;Gh(t,wh,ze);let n=Te[e]*ze[1],r=Te[e]*ze[2],i=ye[e],a=e*Wh;for(let e=0;e<i;e++){let t=be[a+e],o=G[a+e];if(o!==0){qe[t]+=n*o;for(let e=0;e<i;e++){let n=be[a+e],i=r*o*G[a+e];i!==0&&(t<m?n<m?He[(Math.floor(t/3)*Uh+12)*9+t%3*3+n%3]+=i:We[(n-m)*m+t]+=i:n>=m&&(Ge[(t-m)*E+(n-m)]+=i))}}}}for(let e of S){let t=(e*Uh+12)*9;He[t]+=N,He[t+4]+=N,He[t+8]+=N}if(Pe.length){for(let e of Pe){let t=Fe[e]-Ae[3*e+2];t<wh&&(Gh(t,wh,ze),qe[3*e+2]-=Th*ze[1],He[(e*Uh+12)*9+8]+=Th*ze[2]);for(let t=0;t<Uh;t++){let n=(e*Uh+t)*9;for(let e=0;e<6;e++)He[n+e]=0}let n=(e*Uh+12)*9;He[n]=He[n+4]=j,He[n+6]=He[n+7]=0;let r=Math.floor(e/c),i=e%c;for(let t=-2;t<=2;t++)for(let n=-2;n<=2;n++){let a=r+t,o=i+n;if(t===0&&n===0||a<0||o<0||a>=c||o>=c)continue;let s=a*c+o;if(!b[s])continue;let l=(s*Uh+Zh(c,s,e))*9;for(let e=0;e<3;e++)He[l+e*3]=He[l+e*3+1]=0}}Le(qe)}let t=performance.now();pt.assemble+=t-e,Ue.setup(N);let r=performance.now();if(pt.mg+=r-t,E>0){for(let e=0;e<E;e++){et.set(We.subarray(e*m,(e+1)*m));let t=Ke.subarray(e*m,(e+1)*m);Ue.apply(et,t),Le(t)}for(let e=0;e<E;e++){for(let t=0;t<=e;t++){let n=Ge[e*E+t],r=e*m,i=t*m,a=B[Math.floor(e/3)];for(let e=0;e<a.length;e++)n-=We[r+a[e]]*Ke[i+a[e]];J[e*E+t]=J[t*E+e]=n}J[e*E+e]+=1e-12*j+1e-9*Math.abs(J[e*E+e])}for(let e=0;e<E;e++)J[e*E+e]>1e-9*j||(J[e*E+e]=1e-9*j);Xm(J,E)}let i=performance.now();pt.schur+=i-r,Xe.fill(0);for(let e of S)for(let t=0;t<3;t++)Xe[3*e+t]=-qe[3*e+t];for(let e=m;e<D;e++)Xe[e]=-qe[e];Je.fill(0),at(Xe,Ze),Qe.set(Ze);let o=ot(Xe,Ze),s=o,l=0;for(;l<Ih;l++){it(Qe,$e);let e=ot(Qe,$e);if(!(e>0)){l===0&&Je.set(Ze);break}let t=o/e;for(let e of S)for(let n=0;n<3;n++){let r=3*e+n;Je[r]+=t*Qe[r],Xe[r]-=t*$e[r]}for(let e=m;e<D;e++)Je[e]+=t*Qe[e],Xe[e]-=t*$e[e];at(Xe,Ze);let n=ot(Xe,Ze);if(l+1>=Lh&&Math.sqrt(Math.abs(n))<=Fh*Math.sqrt(Math.abs(s))){l++;break}let r=n/o;o=n;for(let e of S)for(let t=0;t<3;t++){let n=3*e+t;Qe[n]=Ze[n]+r*Qe[n]}for(let e=m;e<D;e++)Qe[e]=Ze[e]+r*Qe[e]}ut+=l;let u=performance.now();pt.cg+=u-i;let d=0;for(let e of C)for(let t=0;t<3;t++)d=Math.max(d,Math.abs(Je[3*e+t]));for(let e=m;e<D;e++)d=Math.max(d,Math.abs(Je[e]));if(d<=Mh){lt=!0;break}let f=0;for(let e of S)for(let t=0;t<3;t++)f+=qe[3*e+t]*Je[3*e+t];for(let e=m;e<D;e++)f+=qe[e]*Je[e];let p=Math.min(1,ft/d);for(let e=0;e<ve;e++){let t=e*Wh,n=0;for(let r=0;r<ye[e];r++)n+=G[t+r]*Je[be[t+r]];n<0&&(p=Math.min(p,Hh*K(e,Ae)/-n))}let h=1e-12*Math.abs(st),v=1/0,y=0,T=0,k=-1;for(;y<zh;y++,p/=2){Ye.set(Ae);for(let e of S)for(let t=0;t<3;t++)Ye[3*e+t]+=p*Je[3*e+t];for(let e=m;e<D;e++)Ye[e]+=p*Je[e];T=0,k=-1;for(let e of C){let t=ke(Ye,e,Oe),n=Math.min(wh/10,Math.max(Eh,.2*nt[e]));if(t>=n)continue;let r=Oe[1]*g+Oe[2]*_,i=-Oe[1]*_+Oe[2]*g,a=Ye[3*e],o=Ye[3*e+1],s=Ye[3*e+2],c=(n-t)/(1+r*r+i*i);if(Ye[3*e]-=r*c,Ye[3*e+1]-=i*c,Ye[3*e+2]+=c,t=ke(Ye,e,Oe),t<n)Ye[3*e+2]+=n-t;else if(e===gt&&_t>=kh&&t>Ah*n){let t=Ye[3*e],r=Ye[3*e+1],i=Ye[3*e+2],c=0,l=1;for(let u=0;u<jh;u++){let u=(c+l)/2;Ye[3*e]=a+(t-a)*u,Ye[3*e+1]=o+(r-o)*u,Ye[3*e+2]=s+(i-s)*u,ke(Ye,e,Oe)<n?c=u:l=u}Ye[3*e]=a+(t-a)*l,Ye[3*e+1]=o+(r-o)*l,Ye[3*e+2]=s+(i-s)*l}T++,k=e}for(let e of Pe){let t=Fe[e]-Ye[3*e+2],n=Math.min(wh/10,Math.max(Eh,.2*(Fe[e]-Ae[3*e+2])));t<n&&(Ye[3*e+2]-=n-t,T++)}if(v=Ve(Ye),v<st-h||T===0&&v<=st+Rh*p*f+h)break}if(ct++,mt+=y,pt.line+=performance.now()-u,y===zh){if(ge){dt=!1;continue}break}let P=0;for(let e of C)for(let t=0;t<3;t++)P=Math.max(P,Math.abs(Ye[3*e+t]-Ae[3*e+t]));for(let e=m;e<D;e++)P=Math.max(P,Math.abs(Ye[e]-Ae[e]));Ae.set(Ye),st=v,a?.onStep?.(ct,p,y,T,P,l,st,k,k<0?0:nt[k],ge);let F=T===1&&k>=0;if(F&&k===gt?_t++:(_t=+!!F,gt=F?k:-1),dt=T===0&&p===1,P<=Mh&&p===1){lt=!0;break}}a&&(a.rounds=ct,a.converged=lt,a.cg=ut,a.ms=pt,a.rows=ve,a.planes=T,a.halvings=mt,a.exactSteps=ht);for(let e=0;e<n.length;e++){if(w[e]<0)continue;let t=O(e),n=i[e];n.h=Ae[t],n.ax=Ae[t+1],n.ay=Ae[t+2],n.capped=De(e,Ae)<wh}return Ae.subarray(0,m).slice()}var rg=.3,ig=.8,ag=.3,og=.04,sg=.7,cg=.6;function lg(e){return e<=0?1:Math.max(ag,ig**e)}function ug(e){return Math.max(sg,1-og*Math.max(0,e))}function dg(e,t){return(1-lg(e)*t)/(1-ag*sg)}function fg(e,t,n){return n*dg(e,t)}function pg(e,t,n){return e>0?Math.min(e,t*n):0}var mg=new Float64Array,hg=new Float32Array,gg=new Float32Array;function _g(e,t,n,r,i,a,o){hg.length<i&&(mg=new Float64Array(i),hg=new Float32Array(i),gg=new Float32Array(i)),mg.fill(0,0,i);let s=0;for(let n=0;n<e.length;n++){let r=e[n];if(!r)continue;let i=t[n];for(let e of r)s=Math.max(s,(mg[e]=mg[e]+i)-a)}hg.fill(0,0,i);for(let i=e.length-1;i>=0;i--){let a=n[i];a.fill(0),r[i]=0;let s=e[i];if(!s)continue;let c=t[i],l=0,u=0;for(let e of s){let t=hg[e];t>0&&(a[e]=cg*gg[e],l+=t,u++),hg[e]=t+c,gg[e]=c}r[i]=u>0?l/u/o:0}return ug(s/o)}var vg={source:`brett-werkzeug-01.png`,frameX:912,frameY:970,frameW:1332,frameH:428,objectX:1076,objectY:1134,objectW:1004,objectH:100},yg={source:`brett-werkzeug-butter-05.webp`,frameX:989,frameY:1022,frameW:401,frameH:311,objectX:1040,objectY:1073,objectW:299,objectH:209},bg={source:`brett-werkzeug-jam-01.webp`,baked:!1,frameX:981,frameY:995,frameW:421,frameH:368,objectX:1035,objectY:1049,objectW:313,objectH:260},xg={source:`brett-werkzeug-leberwurst-01.webp`,baked:!1,frameX:959,frameY:968,frameW:530,frameH:388,objectX:1026,objectY:1035,objectW:396,objectH:254},Sg={source:`brett-werkzeug-nutella-05.webp`,baked:!1,frameX:885,frameY:973,frameW:571,frameH:381,objectX:957,objectY:1045,objectW:427,objectH:237},Cg={source:`brett-werkzeug-quark-01.webp`,baked:!1,frameX:870,frameY:1004,frameW:429,frameH:303,objectX:925,objectY:1059,objectW:319,objectH:193},wg={source:`brett-toepfe-01.png`,frameX:120,frameY:569,frameW:556,frameH:558,objectX:190,objectY:639,objectW:416,objectH:418},Tg={source:`brett-toepfe-01.png`,frameX:557,frameY:567,frameW:553,frameH:556,objectX:627,objectY:637,objectW:413,objectH:416},Eg={source:`brett-toepfe-01.png`,frameX:1835,frameY:565,frameW:544,frameH:554,objectX:1905,objectY:635,objectW:404,objectH:414},Dg={source:`brett-toepfe-01.png`,frameX:991,frameY:574,frameW:539,frameH:546,objectX:1060,objectY:643,objectW:401,objectH:408},Og={source:`brett-toepfe-01.png`,frameX:1413,frameY:570,frameW:547,frameH:550,objectX:1482,objectY:639,objectW:409,objectH:412},kg={source:`belag-banane-01.webp`,baked:!1,frameX:1033,frameY:619,frameW:431,frameH:437,objectX:1089,objectY:675,objectW:319,objectH:325},Ag={source:`belag-bismarckhering-01.webp`,baked:!1,frameX:495,frameY:447,frameW:1489,frameH:817,objectX:678,objectY:630,objectW:1123,objectH:451},jg={source:`belag-blutwurst-01.webp`,baked:!1,frameX:843,frameY:489,frameW:784,frameH:762,objectX:941,objectY:587,objectW:588,objectH:566},Mg={source:`belag-chips-01.webp`,baked:!1,frameX:928,frameY:545,frameW:590,frameH:579,objectX:1002,objectY:619,objectW:442,objectH:431},Ng={source:`brett-belag-01.png`,baked:!1,frameX:2282,frameY:1368,frameW:726,frameH:722,objectX:2373,objectY:1459,objectW:544,objectH:540},Pg={source:`belag-erdbeere-07.webp`,baked:!1,frameX:989,frameY:558,frameW:537,frameH:611,objectX:1066,objectY:635,objectW:383,objectH:457},Fg={source:`belag-fischstaebchen-02.webp`,baked:!1,frameX:779,frameY:604,frameW:918,frameH:453,objectX:893,objectY:718,objectW:690,objectH:225},Ig={source:`belag-gewuerzgurke-02.webp`,baked:!1,frameX:109,frameY:59,frameW:888,frameH:1001,objectX:248,objectY:194,objectW:608,objectH:703},Lg={source:`belag-gummibaer-01.webp`,baked:!1,frameX:1171,frameY:718,frameW:181,frameH:285,objectX:1208,objectY:755,objectW:107,objectH:211},Rg={source:`brett-belag-01.png`,baked:!1,frameX:724,frameY:665,frameW:908,frameH:893,objectX:837,objectY:778,objectW:682,objectH:667},zg={source:`belag-harzer-03.webp`,baked:!1,frameX:851,frameY:440,frameW:824,frameH:852,objectX:964,objectY:553,objectW:590,objectH:582},Bg={source:`belag-kaese-02.png`,baked:!1,frameX:819,frameY:454,frameW:810,frameH:740,objectX:920,objectY:555,objectW:608,objectH:538},Vg={source:`belag-kiwi-02.webp`,baked:!1,frameX:871,frameY:495,frameW:744,frameH:704,objectX:964,objectY:588,objectW:558,objectH:518},Hg={source:`belag-lachs-03.webp`,baked:!1,frameX:526,frameY:470,frameW:1382,frameH:784,objectX:696,objectY:640,objectW:1042,objectH:444},Ug={source:`belag-leberkaese-01.webp`,baked:!1,frameX:708,frameY:384,frameW:1049,frameH:889,objectX:838,objectY:514,objectW:789,objectH:629},Wg={source:`belag-marshmallow-02.webp`,baked:!1,frameX:1036,frameY:656,frameW:425,frameH:369,objectX:1090,objectY:710,objectW:317,objectH:261},Gg={source:`belag-pommes-02.webp`,baked:!1,frameX:771,frameY:685,frameW:900,frameH:309,objectX:883,objectY:797,objectW:676,objectH:85},Kg={source:`belag-radieschen-02.png`,baked:!1,frameX:749,frameY:343,frameW:998,frameH:1004,objectX:873,objectY:467,objectW:750,objectH:756},qg={source:`belag-rotebete-01.webp`,baked:!1,frameX:917,frameY:531,frameW:640,frameH:636,objectX:997,objectY:611,objectW:480,objectH:476},Jg={source:`belag-salami-02.png`,baked:!1,frameX:803,frameY:409,frameW:869,frameH:870,objectX:911,objectY:517,objectW:653,objectH:654},Yg={source:`brett-belag-01.png`,baked:!1,frameX:1517,frameY:1441,frameW:1163,frameH:1414,objectX:1691,objectY:1615,objectW:815,objectH:1066},Xg={source:`brett-belag-01.png`,baked:!1,frameX:3263,frameY:1839,frameW:745,frameH:788,objectX:3361,objectY:1937,objectW:549,objectH:592},Zg={source:`belag-schokolinse-01.webp`,baked:!1,frameX:1153,frameY:751,frameW:200,frameH:201,objectX:1180,objectY:778,objectW:146,objectH:147},Qg={source:`belag-senfgurke-03.webp`,baked:!1,frameX:858,frameY:632,frameW:755,frameH:445,objectX:952,objectY:726,objectW:567,objectH:257},$g={source:`belag-spiegelei-01.webp`,baked:!1,frameX:740,frameY:399,frameW:951,frameH:885,objectX:858,objectY:517,objectW:715,objectH:649},e_={source:`belag-tomate-04.webp`,baked:!1,frameX:856,frameY:497,frameW:780,frameH:709,objectX:953,objectY:594,objectW:586,objectH:515},t_=[`butter`,`jam`,`nutella`,`quark`,`leberwurst`],n_={butter:`Butter`,jam:`Jam`,nutella:`Chocolate spread`,quark:`Quark`,leberwurst:`Liver pâté`},$={kaese:{cm:8.8,thick:.25,drape:!0,stiff:.45,rim:!0,plate:2.3,squish:.1},salami:{cm:4.5,thick:.25,drape:!0,stiff:1.75,rim:!0,squish:.1},schinken:{cm:8.5,thick:.15,drape:!0,stiff:.35,rim:!0,layers:8,fold:!0,plate:1.7,squish:.4},gurke:{cm:4.5,thick:.5,drape:!0,stiff:2,rim:!0,round:.04,edge:{tex:`gurke`},squish:.05,wet:.42,dim:.88},tomate:{cm:6.5,thick:.5,drape:!0,stiff:1.05,rim:!0,edge:{tex:`tomate`},squish:.3,wet:.85},ei:{cm:4.5,thick:.45,drape:!0,stiff:2.5,rim:!0,squish:.2,wet:.35,dim:.93},radieschen:{cm:2.8,thick:.25,drape:!1,squish:.03},gewuerzgurke:{cm:6,thick:.5,drape:!0,stiff:1.6,rim:!0,edge:{tex:`gewuerzgurke`},squish:.08,wet:.8},leberkaese:{cm:9,thick:.8,drape:!0,stiff:3,rim:!0,edge:{tex:`leberkaese`},squish:.15},harzer:{cm:4.5,thick:1,drape:!1,shape:{kind:`round`,round:.1,up:.5,wall:!0},edge:{tex:`harzer`},squish:.08,dim:.93},blutwurst:{cm:4.3,thick:.4,drape:!0,stiff:1.9,rim:!0,squish:.15},spiegelei:{cm:9.5,thick:.1,drape:!0,stiff:.05,bend:.94,rim:!0,layers:8,plate:.7,squish:.4,wet:.3},rotebete:{cm:5.5,thick:.4,drape:!0,stiff:1.4,rim:!0,squish:.05,wet:.7},senfgurke:{cm:5.5,thick:.25,drape:!0,stiff:1.2,rim:!0,edge:{tex:`senfgurke`},squish:.08,wet:.8},lachs:{cm:9,thick:.12,drape:!0,stiff:.3,bend:.95,rim:!0,plate:.4,squish:.3,wet:.6},bismarckhering:{cm:10,thick:.6,drape:!1,shape:{kind:`round`,round:.8,up:.75},squish:.2},schnittlauch:{cm:5,thick:.2,drape:!0,stiff:0,squish:.6},banane:{cm:3.2,thick:.4,drape:!1,shape:{kind:`round`,round:.1,up:.5,wall:!0},squish:.25,dim:.9},erdbeere:{cm:2.8,thick:.4,drape:!1,edge:{tex:`erdbeere`,bulge:.02,own:!0},squish:.15},kiwi:{cm:4.7,thick:.4,drape:!0,stiff:1.5,rim:!0,squish:.2,wet:.35},fischstaebchen:{cm:9,thick:1.2,drape:!0,stiff:3.5,rim:!0,round:.2,edge:{tex:`fischstaebchen`},squish:.1},pommes:{cm:5.7,thick:.72,drape:!1,shape:{kind:`round`,round:.1,up:.5,wall:!0},edge:{tex:`pommes`},vary:{length:[.5,1.15],bow:.3,kink:.55,width:.08},squish:.2,dim:.88},chips:{cm:5,thick:.8,drape:!1,shape:{kind:`shell`,skin:.12,seed:7},squish:.3},marshmallow:{cm:3,thick:2.4,drape:!1,shape:{kind:`round`,round:1.1,up:.5},squish:.5},schokolinse:{cm:1.2,thick:.5,drape:!1,shape:{kind:`round`,round:.6,up:.5},squish:.02},gummibaer:{cm:1.1,thick:.75,drape:!1,shape:{kind:`round`,round:.45,up:.8,relief:.45,mirror:!0,extra:.1},squish:.1},deckeltoast:{cm:8.47,thick:1.1,drape:!0,stiff:3.2,rim:!0,edge:{tex:`deckeltoast`},squish:.12},deckelroggenmisch:{cm:9.33,thick:1.1,drape:!0,stiff:3.2,rim:!0,edge:{tex:`deckelroggenmisch`},squish:.12},deckelgraubrot:{cm:10.33,thick:1.1,drape:!0,stiff:3.2,rim:!0,edge:{tex:`deckelgraubrot`},squish:.12},deckelvollkorn:{cm:8.74,thick:1.1,drape:!0,stiff:3.2,rim:!0,edge:{tex:`deckelvollkorn`},squish:.12}},r_=Object.keys($),i_=[`schnittlauch`,`schokolinse`],a_=[`bismarckhering`,`marshmallow`];r_.filter(e=>!i_.includes(e)&&!a_.includes(e));var o_=Object.assign({"../../public/tools/top-deckeltoast.json":{"source":"toast-slice.webp","baked":false,"frameX":0,"frameY":0,"frameW":758,"frameH":902,"objectX":101,"objectY":101,"objectW":556,"objectH":700},"../../public/tools/top-deckelroggenmisch.json":{"source":"roggenmisch-slice.webp","baked":false,"frameX":0,"frameY":0,"frameW":816,"frameH":902,"objectX":101,"objectY":101,"objectW":614,"objectH":700},"../../public/tools/top-deckelgraubrot.json":{"source":"graubrot-slice.webp","baked":false,"frameX":0,"frameY":0,"frameW":932,"frameH":902,"objectX":101,"objectY":101,"objectW":730,"objectH":700},"../../public/tools/top-deckelvollkorn.json":{"source":"vollkorn-slice.webp","baked":false,"frameX":0,"frameY":0,"frameW":776,"frameH":902,"objectX":101,"objectY":101,"objectW":574,"objectH":700},"../../public/tools/knife.json":vg,"../../public/tools/lump-butter-1.json":yg,"../../public/tools/lump-jam-1.json":bg,"../../public/tools/lump-leberwurst-1.json":xg,"../../public/tools/lump-nutella-1.json":Sg,"../../public/tools/lump-quark-1.json":Cg,"../../public/tools/pot-butter.json":wg,"../../public/tools/pot-jam.json":Tg,"../../public/tools/pot-leberwurst.json":Eg,"../../public/tools/pot-nutella.json":Dg,"../../public/tools/pot-quark.json":Og,"../../public/tools/top-banane.json":kg,"../../public/tools/top-bismarckhering.json":Ag,"../../public/tools/top-blutwurst.json":jg,"../../public/tools/top-chips.json":Mg,"../../public/tools/top-ei.json":Ng,"../../public/tools/top-erdbeere.json":Pg,"../../public/tools/top-fischstaebchen.json":Fg,"../../public/tools/top-gewuerzgurke.json":Ig,"../../public/tools/top-gummibaer.json":Lg,"../../public/tools/top-gurke.json":Rg,"../../public/tools/top-harzer.json":zg,"../../public/tools/top-kaese.json":Bg,"../../public/tools/top-kiwi.json":Vg,"../../public/tools/top-lachs.json":Hg,"../../public/tools/top-leberkaese.json":Ug,"../../public/tools/top-marshmallow.json":Wg,"../../public/tools/top-pommes.json":Gg,"../../public/tools/top-radieschen.json":Kg,"../../public/tools/top-rotebete.json":qg,"../../public/tools/top-salami.json":Jg,"../../public/tools/top-schinken.json":Yg,"../../public/tools/top-schnittlauch.json":Xg,"../../public/tools/top-schokolinse.json":Zg,"../../public/tools/top-senfgurke.json":Qg,"../../public/tools/top-spiegelei.json":$g,"../../public/tools/top-tomate.json":e_});function s_(e){let t=o_[`../../public/tools/${e}.json`];if(!t)throw Error(`no frame for ${e}`);return t}var c_={"top-harzer":2,"edge-harzer":2,"top-lachs":2,"top-gewuerzgurke":2},l_=(e,t=``)=>`./tools/${e}${t}.${t===``||t===`-shadow`?`webp`:t===`-outline`?`json`:`png`}${c_[e]?`?v=${c_[e]}`:``}`,u_=e=>(e+.5)/128-.5,d_=e=>.5-(e+.5)/128,f_=e=>u_(e%128),p_=e=>d_(Math.floor(e/128)),m_=(e,t)=>Math.min(127,Math.max(0,Math.floor((.5-t)*128)))*128+Math.min(127,Math.max(0,Math.floor((e+.5)*128))),h_=(e,t)=>{t&&(e.sup.set(t),e.flat.set(t)),e.owner.fill(-1),e.bottom.fill(-1/0),e.beneath.fill(-1/0),e.beneathOwner.fill(-1)},g_=()=>{let e={sup:new Float32Array(16384),flat:new Float32Array(16384),owner:new Int16Array(16384),bottom:new Float32Array(16384),beneath:new Float32Array(16384),beneathOwner:new Int16Array(16384)};return h_(e),e},__=e=>({sup:e.sup.slice(),flat:e.flat.slice(),owner:e.owner.slice(),bottom:e.bottom.slice(),beneath:e.beneath.slice(),beneathOwner:e.beneathOwner.slice()}),v_=(e,t)=>{e.sup.set(t.sup),e.flat.set(t.flat),e.owner.set(t.owner),e.bottom.set(t.bottom),e.beneath.set(t.beneath),e.beneathOwner.set(t.beneathOwner)};function y_(e,t,n,r,i){return n>=e.flat[t]?(e.beneath[t]=e.flat[t],e.beneathOwner[t]=e.owner[t],e.flat[t]=n,e.owner[t]=i,e.bottom[t]=r,!0):(n>e.beneath[t]&&(e.beneath[t]=n,e.beneathOwner[t]=i),!1)}function b_(e,t,n){if(e.on.length===0||t[0]<=0)return;let r=t[1]/t[0],i=t[2]/t[0],a=0;for(let{x:t,y:n}of e.on)a+=1/(Math.hypot(t-r,n-i)+.01);for(let{q:o,x:s,y:c,r:l}of e.on){let e=n.get(o);if(!e)continue;let u=t[0]/(Math.hypot(s-r,c-i)+.01)/a,d=r-s,f=i-c,p=Math.hypot(d,f);p>l&&(d*=l/p,f*=l/p),e[0]+=u,e[1]+=u*(s+d),e[2]+=u*(c+f)}}function x_(e,t,n){let r=new Set;return t.forEach((t,i)=>{let{v:a,x:o,y:s,off:c}=t.on;for(let l=0;l<a.length;l++)if(Cm(t,t.cx,t.cy,o[l],s[l])-n(a[l])-c[l]<=$v){r.add(e.pieces[i].q.id);return}}),r}var S_=0;function C_(e){S_=Math.max(S_,e)}var w_=new Float32Array,T_=new Float32Array,E_=new Int32Array,D_=new Int32Array,O_=new Float64Array,k_=new Float64Array,A_=new Float64Array;function j_(e,t,n,r,i,a){let o=e.length;O_.length<o&&(O_=new Float64Array(o*2),k_=new Float64Array(o*2),A_=new Float64Array(o*2));for(let n=0;n<o;n++){let r=e[n];O_[n]=f_(r),k_[n]=p_(r),A_[n]=t[r]-(a?a[n]:0)}return mm(o,O_,k_,A_,n,r,void 0,i)}var M_=e=>A_[e]>-1/0;function N_(e,t,n,r,i){let a=-1/0;for(let o=0;o<e;o++){if(!M_(o))continue;let e=A_[o]-r*(O_[o]-t)-i*(k_[o]-n);e>a&&(a=e)}return a}var P_=.1/11,F_=1.5/11,I_=.03/11;function L_(e,t,n,r,i,a){let o=e.length,s=-1,c=1/0;for(let e=0;e<o;e++){if(!M_(e))continue;let t=O_[e]-r,n=k_[e]-i,a=t*t+n*n;a<c&&(c=a,s=e)}if(s<0||c>2/128*(2/128))return;let l=n[e[s]];if(l<0)return;let u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0;for(let a=0;a<o;a++){let o=e[a];if(n[o]!==l||!M_(a))continue;let s=O_[a]-r,c=k_[a]-i;if(s*s+c*c>F_*F_)continue;let y=t[o];u+=s*s,d+=s*c,f+=c*c,p+=s,m+=c,h+=y,g+=s*y,_+=c*y,v++}if(v<6)return;let y=u-p*p/v,b=d-p*m/v,x=f-m*m/v,S=g-p*h/v,C=_-m*h/v,w=.5/128*v*(.5/128),T=y+w,E=x+w,D=T*E-b*b;if(D<=0)return;let O=S+w*a.ax,k=C+w*a.ay,A=(O*E-k*b)/D,j=(T*k-b*O)/D,M=Math.hypot(A,j);M>im&&(A*=im/M,j*=im/M);let N=N_(o,r,i,A,j);if(!(N<=a.h+P_))return;let P=0,F=0;for(let e=0;e<o;e++){if(!M_(e))continue;let t=O_[e]-r,n=k_[e]-i;N+A*t+j*n-A_[e]<=I_&&P++,a.h+a.ax*t+a.ay*n-A_[e]<=I_&&F++}P<=F||(a.h=N,a.ax=A,a.ay=j)}function R_(e,t,n,r,i,a){for(let o=0;o<e.length;o++){let s=e[o];if(t[s]===-1/0)continue;let c=typeof a==`number`?a:a[o];t[s]=Math.max(t[s],Cm(n,r,i,f_(s),p_(s))+c)}}var z_=new Uint8Array(4225),B_=new Float32Array(4225),V_=new Int32Array(4225),H_=new Uint8Array(4225);function U_(e,t,n,r,i,a){return K_(e,t,n,W_),q_(W_,r,i,a,G_),[G_[0],G_[1]]}var W_=new Float64Array(4),G_=new Float64Array(3);function K_(e,t,n,r){let i=-e,a=-t,o=1,s=1/(Math.sqrt(i*i+a*a+o*o)||1);i*=s,a*=s,o*=s;let c=-a,l=i,u=1+o,d=1/(Math.sqrt(c*c+l*l+u*u)||1);c*=d,l*=d,u*=d;let f=Math.sin(n/2),p=Math.cos(n/2);r[0]=-(c*p+l*f),r[1]=-(l*p-c*f),r[2]=-(u*f),r[3]=u*p}function q_(e,t,n,r,i){let a=e[0],o=e[1],s=e[2],c=e[3],l=2*(o*r-s*n),u=2*(s*t-a*r),d=2*(a*n-o*t);i[0]=t+c*l+o*d-s*u,i[1]=n+c*u+s*l-a*d,i[2]=r+c*d+a*u-o*l}function J_(e,t,n,r){let i=Math.min(e.gw-1,Math.max(0,Math.round(t*(e.gw-1)))),a=Math.min(e.gh-1,Math.max(0,Math.round(n*(e.gh-1))));return Math.max(0,e[r][a*e.gw+i])/11}var Y_=8,X_=1e-6,Z_=4,Q_=3,$_=1e-4;function ev(e,t,n,r,i){let a=new Float32Array(t.length),o=e.asset,s=$[e.type].shape?o.shape:null,c=$[e.type].thick/11,l=new Float64Array(4);K_(r,i,e.rot,l);let u=1/Math.sqrt(r*r+i*i+1),d=(e,t,n)=>s?J_(s,e,t,n):n===`bot`?0:c,f=0,p=0,m=new Float64Array(3),h=(t,n,r,i)=>{for(let a=0;a<Y_;a++){q_(l,t,n,r,m),f=m[0]/e.w+e.cx,p=e.cy-m[1]/e.h;let a=m[2],o=d(f,p,`bot`),s=((i===0?o:o+i*(d(f,p,`top`)-o))-a)/u;if(r+=s,Math.abs(s)<X_)break}return r};for(let s=0;s<t.length;s++){let c=t[s],l=f_(c)-e.x,u=p_(c)-e.y,d=r*l+i*u,m=NaN;for(let e=0;e<=Z_;e++){let t=h(l,u,d,n===`bot`?e/Z_:1-e/Z_);if(Sy(o,f,p)){m=t-d;break}}a[s]=Number.isNaN(m)&&n===`bot`?1/0:m}return a}var tv=.75,nv=.9,rv=.6,iv=8e-4,av=.001,ov=1.25,sv=140,cv=.02,lv=.02/11,uv=.1/11,dv=.8,fv=.85,pv=.01,mv=.005,hv=120,gv=1.15,_v=.5,vv=3,yv=Object.fromEntries(Object.entries($).flatMap(([e,t])=>t.plate===void 0?[]:[[e,t.plate]])),bv=[.2,10],xv=16,Sv=24,Cv=12,wv=.005/11,Tv=2,Ev=im/128,Dv=new Float32Array;function Ov(e,t,n,r){let i=n*r;Dv.length<i&&(Dv=new Float32Array(i));let a=Dv;a.set(e.subarray(0,i));let o=(e,t,i)=>{let a=i?Ev:0;for(let o=0;o<r;o++)for(let r=0;r<n;r++){let s=e[o*n+r];for(let t=1;t<=Tv;t++){if(r-t>=0){let c=e[o*n+r-t]+a*t;(i?c<s:c>s)&&(s=c)}if(r+t<n){let c=e[o*n+r+t]+a*t;(i?c<s:c>s)&&(s=c)}}t[o*n+r]=s}for(let o=0;o<n;o++)for(let s=0;s<r;s++){let c=t[s*n+o];for(let e=1;e<=Tv;e++){if(s-e>=0){let r=t[(s-e)*n+o]+a*e;(i?r<c:r>c)&&(c=r)}if(s+e<r){let r=t[(s+e)*n+o]+a*e;(i?r<c:r>c)&&(c=r)}}e[s*n+o]=c}};o(e,t,!0),o(e,t,!1);for(let t=0;t<i;t++)e[t]>a[t]&&(e[t]=a[t])}var kv=.2/11,Av=60,jv=Math.SQRT1_2,Mv=Math.tan(40*Math.PI/180),Nv=Math.tan(25*Math.PI/180),Pv=.15/11,Fv=2,Iv=Math.tan(2*Math.PI/180),Lv=.05/11,Rv=.5,zv=.009,Bv=40*Math.PI/180,Vv=60*Math.PI/180,Hv=e=>Math.min(Vv,Bv/e),Uv=.05/11,Wv=.1,Gv=.25,Kv=4,qv=12,Jv=6,Yv=.3/11/10,Xv=Yv/20,Zv=Yv,Qv=.1/11,$v=.2/11,ey=6,ty=6,ny=2,ry=.05/11,iy=.002,ay=2,oy=.2,sy=Math.tan(4.5*Math.PI/180),cy=Math.tan(9*Math.PI/180),ly=15/1331,uy=.05/11/10,dy=Math.tan(10*Math.PI/180),fy=.02,py=.4/11,my=1.7,hy=kv*5,gy=.4/11,_y=.1/11,vy=.1;function yy(e){return{xyz:e.xyz.slice(),fold:e.fold?.slice()??null,shift:e.shift?.slice()??null,stuck:e.stuck,hold:e.hold?[e.hold[0],e.hold[1]]:null,flatAt:e.flatAt,ground:e.ground?.slice()??null,tips:e.tips?[e.tips[0],e.tips[1]]:null}}function by(e,t,n,r,i){let a=Math.min(63,Math.floor(e*n)),o=Math.min(63,Math.floor(t*n)),s=a*65+o;return{i:Math.round(e*n)*65+Math.round(t*n),x:Jb(r,s,65,e*n-a,t*n-o),y:Jb(i,s,65,e*n-a,t*n-o)}}function xy(e,t,n,r,i){let a=Math.min(t-1.001,Math.max(0,r*(t-1))),o=Math.min(n-1.001,Math.max(0,i*(n-1))),s=Math.floor(a),c=Math.floor(o),l=a-s,u=o-c,d=(n,r)=>e[r*t+n];return(d(s,c)*(1-l)+d(s+1,c)*l)*(1-u)+(d(s,c+1)*(1-l)+d(s+1,c+1)*l)*u}function Sy(e,t,n){return t<0||n<0||t>=1||n>=1?!1:e.alpha[Math.floor(n*e.ah)*e.aw+Math.floor(t*e.aw)]>=128}function Cy(e,t,n,r,i){let a=n*n,o=new Uint8Array(a),s=(n,r)=>Math.hypot(e[r*2]-e[n*2]+t[r*2]-t[n*2],e[r*2+1]-e[n*2+1]+t[r*2+1]-t[n*2+1]);for(let e=0;e<a;e++)e%n<n-1&&s(e,e+1)<r*dv&&(o[e]=o[e+1]=1),e+n<a&&s(e,e+n)<i*dv&&(o[e]=o[e+n]=1);return o}function wy(e,t,n,r,i,a,o,s,c,l,u){let d=o-1;for(let f=0;f<hv;f++){let f=0;for(let l=0;l<a.length;l++){let u=a[l],p=u%o,m=(u-p)/o;for(let a=0;a<4;a++){let l=a===0?p>0?u-1:-1:a===1?p<d?u+1:-1:a===2?m>0?u-o:-1:m<d?u+o:-1;if(l<0||!i[l]||r[u]&&r[l])continue;let h=a<2?s:c,g=e[l]-e[u],_=t[l]-t[u],v=n[l]-n[u],y=Math.sqrt(g*g+_*_+v*v),b=y>h?h:y<h*_v?h*_v:y;if(b===y||y===0)continue;let x=+!r[u],S=+!r[l];if(x+S===0)continue;f=Math.max(f,y/h,h*_v/y);let C=(y-b)/y/(x+S);e[u]+=g*C*x,t[u]+=_*C*x,n[u]+=v*C*x,e[l]-=g*C*S,t[l]-=_*C*S,n[l]-=v*C*S}}for(let i=0;i<a.length;i++){let o=a[i];if(r[o])continue;let s=l(e[o],t[o]);n[o]<s&&(n[o]=s),u[o]=s}if(f<=gv)break}}var Ty=(e,t)=>Math.min(e,t*1),Ey=(e,t,n)=>e?n*(e[t]-1):0,Dy=(e,t)=>e*Math.min(ay,t);function Oy(e,t,n,r){return Math.min(e,Math.max(Ty(e,r),t-n))}function ky(e,t,n,r){let i=Float32Array.from(e),a=Math.hypot(n,r),o=(e,t,n)=>{let r=i[t]+n;r<i[e]&&(i[e]=r)};for(let e=0;e<t;e++)for(let i=0;i<t;i++){let s=e*t+i;i>0&&o(s,s-1,n),e>0&&(o(s,s-t,r),i>0&&o(s,s-t-1,a),i<t-1&&o(s,s-t+1,a))}for(let e=t-1;e>=0;e--)for(let i=t-1;i>=0;i--){let s=e*t+i;i<t-1&&o(s,s+1,n),e<t-1&&(o(s,s+t,r),i<t-1&&o(s,s+t+1,a),i>0&&o(s,s+t-1,a))}return i}function Ay(e,t,n,r,i,a,o,s){let c=a*a,l=z_,u=B_,d=e=>Ey(r,e,i),f=e=>{let t=Ty(d(e),i),r=n[e]+t;return o?Math.min(r,o[e]+t):r};l.fill(0);let p=!1;for(let n=0;n<c;n++)e[n]+d(n)<=t[n]||(e[n]=Math.max(f(n),t[n],o?-1/0:e[n]-s)-d(n),l[n]=1,p=!0);if(!p)return;for(let t=0;t<c;t++)u[t]=e[t]+d(t);let m=a-1;for(let e=0;e<Jv;e++){let e=0;for(let t=0,n=0;t<a;t++)for(let r=0;r<a;r++,n++)l[n]||(r>0&&l[n-1]||r<m&&l[n+1]||t>0&&l[n-a]||t<m&&l[n+a])&&(V_[e++]=n);for(let t=0;t<e;t++)l[V_[t]]=2;for(let e=0,t=0;e<a;e++)for(let n=0;n<a;n++,t++){if(l[t]!==2)continue;let r=0,i=0;n>0&&(r+=u[t-1],i++),n<m&&(r+=u[t+1],i++),e>0&&(r+=u[t-a],i++),e<m&&(r+=u[t+a],i++),u[t]=Math.max(f(t),Math.min(u[t],r/i))}}for(let t=0;t<c;t++)l[t]===2&&(e[t]=u[t]-d(t))}function jy(e,t,n,r,i,a,o){let s=[];for(let n of e)t.bottom[n]-t.beneath[n]>r&&s.push(n);if(s.length===0||s.length===e.length)return null;let c=My,l=Ny;for(let n of e)c[n]=t.flat[n],l[n]=t.owner[n];for(let e of s)c[e]=t.beneath[e],l[e]=t.beneathOwner[e];let u=Py;for(let d=0;d<Kv&&s.length>0;d++){if(j_(e,c,i,a,u,n),u.capped&&Jy(e,c,l,n,r,i,a,u),u.capped&&u.h>=o)return null;let d=wm(r,u.ax,u.ay),f=[];for(let e of s)Cm(u,i,a,f_(e),p_(e))+d<=t.bottom[e]?f.push(e):(c[e]=t.flat[e],l[e]=t.owner[e]);if(f.length===s.length)return{sup:c,owner:l};s=f}return null}var My=new Float32Array(16384),Ny=new Int16Array(16384),Py={h:0,ax:0,ay:0,capped:!1},Fy=2,Iy=4,Ly=3/128,Ry=.05/11,zy=.15/11,By=e=>.15*e+.001,Vy=4/128;function Hy(e,t,n,r,i){let a=Math.hypot(r,i),o=r/a,s=i/a,c=0;for(let r=0;r<e;r++)c=Math.max(c,(f_(D_[r])-t)*o+(p_(D_[r])-n)*s);let l=[];if(c<=Ly)return l;for(let r=0;r<e;r++){let e=f_(D_[r]),i=p_(D_[r]);(e-t)*o+(i-n)*s>c-Vy&&l.push(e,i)}return l}var Uy=Math.tan(5*Math.PI/180),Wy=.75,Gy=e=>Array.from({length:8},(t,n)=>[Math.cos(n*Math.PI/4)*e/128,Math.sin(n*Math.PI/4)*e/128]),Ky=Gy(Iy),qy=Gy(7);function Jy(e,t,n,r,i,a,o,s,c=Fy,l=!1){let u=new Set(e),d=new Set;for(let t of e){let e=t%128,n=(t-e)/128;e!==0&&n!==0&&e!==127&&n!==127&&u.has(t-1)&&u.has(t+1)&&u.has(t-128)&&u.has(t+128)||d.add(t)}let f=new Set(d);for(let e=1;e<c;e++){let e=new Set;for(let t of d)for(let n of[t-1,t+1,t-128,t+128])u.has(n)&&!f.has(n)&&e.add(n);for(let t of e)f.add(t);d=e}let p=[],m=[],h=[];for(let i=0;i<e.length;i++){let a=e[i];f.has(a)&&t[a]-r[i]>s.h&&(p.push(a),m.push(t[a]),h.push(n[a]),t[a]=-1/0,n[a]=-1)}if(p.length===0)return!1;let g=s.h;if(j_(e,t,a,o,s,r),!s.capped&&s.h<g-(l?Wy*i:i)&&!Xy(e,t,n,r,a,o,s,h))return!0;for(let e=0;e<p.length;e++)t[p[e]]=m[e],n[p[e]]=h[e];return j_(e,t,a,o,s,r),!1}function Yy(e){let t=e.heldAt;return!!t&&t.x===e.x&&t.y===e.y&&t.rot===e.rot&&Math.abs(e.base-t.base)<=Lv&&Math.hypot(e.ax-t.ax,e.ay-t.ay)<=Iv}function Xy(e,t,n,r,i,a,o,s){let c=new Set(s.filter(e=>e>=0));if(c.size===0)return!1;for(let s=0;s<e.length;s++){let l=e[s];if(t[l]===-1/0||!c.has(n[l]))continue;let u=t[l]-r[s];if(u>o.h&&Cm(o,i,a,f_(l),p_(l))-u<=I_)return!0}return!1}var Zy=new Float32Array(16384),Qy=new Int16Array(16384),$y=new Int32Array,eb=new Float32Array;function tb(e,t,n){let r=n*n;$y.length<r&&($y=new Int32Array(r),eb=new Float32Array(r));let i=$y,a=eb,o=ub(t,n),s=n-1,c=0,l=0;a.fill(NaN,0,r);for(let t=0;t<r;t++)o[t]&&(a[t]=e[t],i[l++]=t);if(l===0)return;let u=(t,n)=>{Number.isNaN(a[t])&&(a[t]=n,e[t]=Math.min(e[t],n),i[l++]=t)};for(;c<l;){let e=i[c++],t=e%n,o=a[e];t>0&&u(e-1,o),t<s&&u(e+1,o),e>=n&&u(e-n,o),e+n<r&&u(e+n,o)}}function nb(e,t,n,r){for(let r=0;r<e.length;r++)e[r]=Math.max(t[r],e[r]-n);return rb(t,r,0,2,e)}function rb(e,t,n,r,i){let a=t*t,o=i===null?new Float32Array(a):Float32Array.from(i??e),s=new Float32Array(a),c=t-1;for(let i=0;i<r;i++){for(let r=0,i=0;r<t;r++){let a=r>0&&r<c;for(let l=0;l<t;l++,i++){let u;if(a&&l>0&&l<c)u=(o[i-1]+o[i+1]+o[i-t]+o[i+t])/4-n;else{let e=0,a=0;l>0&&(e+=o[i-1],a++),l<c&&(e+=o[i+1],a++),r>0&&(e+=o[i-t],a++),r<c&&(e+=o[i+t],a++),u=e/a-n}let d=e[i];s[i]=u>d?u:d}}[o,s]=[s,o]}return o}function ib(e){let t=e.xyz,n=Math.cos(e.rot),r=Math.sin(e.rot);return(i,a)=>{let o=i-e.x,s=a-e.y,c=Math.min(64,Math.max(0,Math.round(((o*n+s*r)/e.w+e.cx)*64))),l=Math.min(64,Math.max(0,Math.round((e.cy-(-o*r+s*n)/e.h)*64)));return t[(l*65+c)*3+2]}}function ab(e,t,n){let r=t-e.x,i=n-e.y,a=Math.cos(e.rot),o=Math.sin(e.rot);return ob(e.xyz,65,(r*a+i*o)/e.w+e.cx,e.cy-(-r*o+i*a)/e.h)}function ob(e,t,n,r){let i=Math.min(t-1.001,Math.max(0,n*(t-1))),a=Math.min(t-1.001,Math.max(0,r*(t-1))),o=Math.floor(i),s=Math.floor(a),c=i-o,l=a-s,u=(n,r)=>e[(n*t+r)*3+2];return(u(s,o)*(1-c)+u(s,o+1)*c)*(1-l)+(u(s+1,o)*(1-c)+u(s+1,o+1)*c)*l}var sb=new Float32Array(4),cb=new Uint32Array(sb.buffer),lb=new WeakMap;function ub(e,t){let n=lb.get(e);n||lb.set(e,n=new Map);let r=n.get(t);if(!r){let i=t-1;r=Uint8Array.from({length:t*t},(n,r)=>+!!Sy(e,r%t/i,Math.floor(r/t)/i)),n.set(t,r)}return r}var db=.4/11,fb=new Float32Array(16384).fill(-1/0),pb=[],mb=new Float64Array(4225),hb=new Float64Array(4225),gb=new Float32Array(16384).fill(-1/0),_b=[];function vb(e){for(let e of pb)fb[e]=-1/0;pb.length=0;let t=e.drawn;if(t&&t.ver===e.ver&&t.x===e.x&&t.y===e.y&&t.rot===e.rot){for(let e=0;e<t.cells.length;e++)fb[t.cells[e]]=t.tops[e],pb.push(t.cells[e]);return fb}let n=e.xyz,r=Math.cos(e.rot),i=Math.sin(e.rot),a=ub(e.asset,65);for(let t=0;t<4225;t++){let a=n[t*3],o=n[t*3+1];mb[t]=e.x+a*r-o*i,hb[t]=e.y+a*i+o*r}let o=-1e-6;for(let e=0;e<64;e++)for(let t=0;t<64;t++){let r=0,i=-1/0,s=1/0,c=-1/0,l=1/0,u=-1/0,d=1/0,f=-1/0;for(let i=0;i<4;i++){let o=(e+(i>>1))*65+t+(i&1);a[o]&&r++,d=Math.min(d,n[o*3+2]),f=Math.max(f,n[o*3+2])}if(r===0)continue;let p=r<4&&f-d>db;for(let r=0;r<4;r++){let o=(e+(r>>1))*65+t+(r&1);if(p&&!a[o])continue;let d=mb[o],f=hb[o];s=Math.min(s,d),c=Math.max(c,d),l=Math.min(l,f),u=Math.max(u,f),a[o]&&(i=Math.max(i,n[o*3+2]))}let m=e*65+t,h=m+65,g=h+1,_=m+1,v=Math.max(0,Math.ceil((s+.5)*128-.5)),y=Math.min(127,Math.floor((c+.5)*128-.5)),b=Math.max(0,Math.ceil((.5-u)*128-.5)),x=Math.min(127,Math.floor((.5-l)*128-.5));for(let e=b;e<=x;e++){let t=d_(e);for(let a=v;a<=y;a++){let s=u_(a);if(r<4){let t=e*128+a;fb[t]===-1/0&&pb.push(t),i>fb[t]&&(fb[t]=i);continue}let c=-1/0;for(let e=0;e<2;e++){let r=e===0?m:h,i=e===0?h:g,a=_,l=mb[i]-mb[r],u=hb[i]-hb[r],d=mb[a]-mb[r],f=hb[a]-hb[r],p=l*f-d*u;if(Math.abs(p)<1e-12)continue;let v=s-mb[r],y=t-hb[r],b=(v*f-d*y)/p,x=(l*y-v*u)/p;if(b<o||x<o||b+x>1.000001)continue;let S=n[r*3+2]+b*(n[i*3+2]-n[r*3+2])+x*(n[a*3+2]-n[r*3+2]);S>c&&(c=S)}if(c===-1/0)continue;let l=e*128+a;fb[l]===-1/0&&pb.push(l),c>fb[l]&&(fb[l]=c)}}}return e.drawn={ver:e.ver,x:e.x,y:e.y,rot:e.rot,cells:Int32Array.from(pb),tops:Float32Array.from(pb,e=>fb[e])},fb}function yb(e,t,n,r,i,a){for(let o=0;o<e.length;o++)if(t[o]&&(o%n<n-1&&t[o+1]&&(e[o+1]-e[o])**2>a*r*r||o+n<e.length&&t[o+n]&&(e[o+n]-e[o])**2>a*i*i))return!0;return!1}function bb(e,t,n){let r=e.length,i=new Int32Array(r),a=new Int32Array(r).fill(-1),o=0;for(let e of n)a[e]=0,i[o++]=e;let s=(t,n)=>{e[t]&&a[t]===-1&&(a[t]=n,i[o++]=t)};for(let e=0;e<o;e++){let n=i[e],o=n%t,c=a[n]+1;o>0&&s(n-1,c),o<t-1&&s(n+1,c),n>=t&&s(n-t,c),n+t<r&&s(n+t,c)}return{order:i,depth:a,tail:o}}function xb(e,t,n,r){let i=new Float32Array(e.length),a=new Float32Array(e.length);for(let a=0;a<n;a++)for(let n=0;n<t;n++){let o=-1/0;for(let i=Math.max(0,n-r);i<=Math.min(t-1,n+r);i++)o=Math.max(o,e[a*t+i]);i[a*t+n]=o}for(let e=0;e<t;e++)for(let o=0;o<n;o++){let s=-1/0;for(let a=Math.max(0,o-r);a<=Math.min(n-1,o+r);a++)s=Math.max(s,i[a*t+e]);a[o*t+e]=s}return a}function Sb(e,t,n,r,i,a,o){let s=xb(e,t,e.length/t,Math.max(1,Math.round(n*.5*128)));return(e,n)=>{let c=Math.floor((e+.5)*128),l=Math.floor((.5-n)*128);return c<r||l<i||c>a||l>o?av:s[(l-i)*t+(c-r)]}}function Cb(e,t,n,r){let i=new Uint8Array(e.length);for(let n=0;n<e.length;n++)i[n]=+(e[n]>t[n]+Xv);let a=n-1;for(let o=0;o<r;o++)for(let r=0,o=0;r<n;r++)for(let s=0;s<n;s++,o++){if(!i[o])continue;let c=0,l=0;s>0&&(c+=e[o-1],l++),s<a&&(c+=e[o+1],l++),r>0&&(c+=e[o-n],l++),r<a&&(c+=e[o+n],l++),e[o]=Math.max(t[o],c/l)}}function wb(e,t,n,r,i){let a=n*Math.sin(i),o=r*Math.sin(i),s=t-1;for(let n=0;n<2;n++){for(let n=0;n<t;n++){let r=n*t;for(let n=1;n<t;n++)e[r+n]=Math.max(e[r+n],e[r+n-1]-a);for(let t=s-1;t>=0;t--)e[r+t]=Math.max(e[r+t],e[r+t+1]-a)}for(let n=0;n<t;n++){for(let r=1;r<t;r++)e[r*t+n]=Math.max(e[r*t+n],e[(r-1)*t+n]-o);for(let r=s-1;r>=0;r--)e[r*t+n]=Math.max(e[r*t+n],e[(r+1)*t+n]-o)}}}function Tb(e){let t=0;for(let n=0;n<e.length;n++)t=Math.max(t,Math.abs(e[n]));return t}var Eb=(e,t,n)=>e===t||Math.abs(e-t)<=n;function Db(e,t,n){for(let r=0;r<e.length;r++)if(!Eb(e[r],t[r],n))return!1;return!0}var Ob=0,kb=()=>Ob;function Ab(e){Ob=Math.max(Ob,e)}function jb(e,t,n,r){if(e.length!==t.length)return!1;let i=0,a=0;for(let o=0;o<e.length;o++){if(e[o]===t[o]||r&&!r[o])continue;let s=Math.abs(e[o]-t[o]);if(!(s<=Zv)&&(s>2*Zv&&(t[o]>e[o]||++a>4)||(i+=s,i>n)))return!1}return!0}function Mb(e,t,n,r,i,a){let o=new Uint8Array(r*i);for(let a of e){let e=a%128-t,s=Math.floor(a/128)-n;e>=0&&s>=0&&e<r&&s<i&&(o[s*r+e]=1)}let s=new Uint8Array(r*i);for(let e=0;e<i;e++){let t=-1/0;for(let n=0;n<r;n++)o[e*r+n]&&(t=n),n-t<=a&&(s[e*r+n]=1);t=1/0;for(let n=r-1;n>=0;n--)o[e*r+n]&&(t=n),t-n<=a&&(s[e*r+n]=1)}let c=new Uint8Array(r*i);for(let e=0;e<r;e++){let t=-1/0;for(let n=0;n<i;n++)s[n*r+e]&&(t=n),n-t<=a&&(c[n*r+e]=1);t=1/0;for(let n=i-1;n>=0;n--)s[n*r+e]&&(t=n),t-n<=a&&(c[n*r+e]=1)}return c}function Nb(e){let t=e/11*128;return Zv*t*t}function Pb(e,t,n){let r=em(e,t,n);return{x:Float64Array.from(r,t=>e[t]),y:Float64Array.from(r,e=>t[e]),z:Float64Array.from(r,e=>n[e])}}var Fb=.012,Ib=.1/11,Lb=Math.PI/180;function Rb(e,t,n){if(Math.abs(t.mass-e.mass)>n)return!1;if(!e.at||!t.at)return!e.at==!t.at;let r=t.mass*(t.at[0]-t.vals[0])-e.mass*(e.at[0]-e.vals[0]),i=t.mass*(t.at[1]-t.vals[1])-e.mass*(e.at[1]-e.vals[1]);return Math.hypot(r,i)<=n*(t.reach??0)}function zb(e){let t=e[5],n=-1/0,r=0;for(let i=ey;i<ey+t;i++)n=Math.max(n,e[i]),r+=e[i];let i=-1/0,a=0,o=0,s=0;for(let n=ey+t;n<e.length;n+=2+e[n+1]){s++;for(let t=n+2;t<n+2+e[n+1];t++)i=Math.max(i,e[t]),a+=e[t],o++}return{hi:n,mean:t>0?r/t:0,overHi:i,overMean:o>0?a/o:0,overs:s}}function Bb(e,t,n=!1){if(Math.hypot(t[0]-e[0],t[1]-e[1])>Ib)return!1;let r=Math.abs(t[2]-e[2])%(2*Math.PI);if(Math.min(r,2*Math.PI-r)>Lb)return!1;if(t.length<=3||e.length<=3)return t.length===e.length;if(n)return!0;if(t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]){if(t.length!==e.length||!Eb(e[4],t[4],Zv))return!1;for(let n=ey;n<t.length;n++)if(!Eb(e[n],t[n],Zv))return!1;return!0}if(!Eb(e[4],t[4],Zv))return!1;let i=zb(e),a=zb(t);return i.overs===a.overs&&Eb(i.hi,a.hi,Ib)&&Eb(i.mean,a.mean,Ib)&&(i.overs===0||Eb(i.overHi,a.overHi,Ib)&&Eb(i.overMean,a.overMean,Ib))}function Vb(e,t,n=0,r=!1){if(e.loads.length!==t.loads.length)return!1;if(r){let n=new Map(e.loads.map(e=>[e.id,e]));for(let e of t.loads){let t=n.get(e.id);if(!t||!Bb(t.vals,e.vals,!0))return!1}return!0}if(!jb(e.sheet,t.sheet,n))return!1;let i=0,a=0;for(let t of e.loads)i+=t.mass;for(let e of t.loads)a+=e.mass;let o=Math.max(.5*Math.min(i,a),Fb);if(Math.abs(a-i)>o)return!1;let s=new Map(e.loads.map(e=>[e.id,e]));for(let e of t.loads){let t=s.get(e.id);if(!t||!Bb(t.vals,e.vals)||!Rb(t,e,o))return!1}return!0}function Hb(e){return Math.hypot(Math.max(e.cx,1-e.cx)*e.w,Math.max(e.cy,1-e.cy)*e.h)}function Ub(e){let t=Hb(e);return[Math.max(0,Math.floor((e.x-t+.5)*128)),Math.min(127,Math.ceil((e.x+t+.5)*128)),Math.max(0,Math.floor((.5-e.y-t)*128)),Math.min(127,Math.ceil((.5-e.y+t)*128))]}function Wb(e){for(;;){let t=e.next();if(t.done)return t.value}}function Gb(e,t){let n=new Float32Array(e.length),r=(e,t,r,i)=>{n[e*3]+=t,n[e*3+1]+=r,n[e*3+2]+=i},i=(t,n,i)=>{let a=e[n*3],o=e[n*3+1],s=e[n*3+2],c=e[i*3]-a,l=e[i*3+1]-o,u=e[i*3+2]-s,d=e[t*3]-a,f=e[t*3+1]-o,p=e[t*3+2]-s,m=l*p-u*f,h=u*d-c*p,g=c*f-l*d;r(t,m,h,g),r(n,m,h,g),r(i,m,h,g)};for(let e=0;e<t-1;e++)for(let n=0;n<t-1;n++){let r=n+t*e,a=n+t*(e+1),o=n+1+t*(e+1),s=n+1+t*e;i(r,a,s),i(a,o,s)}for(let e=0;e<n.length;e+=3){let t=Math.hypot(n[e],n[e+1],n[e+2]);t>0&&(n[e]=n[e]/t,n[e+1]=n[e+1]/t,n[e+2]=n[e+2]/t)}return n}function Kb(e,t,n,r){let i=new Float32Array(8450),a=e/64,o=t/64,s=(.5-n)*e,c=-(.5-r)*t;for(let n=0;n<65;n++){let r=n*o-t/2;for(let t=0;t<65;t++){let o=n*65+t;i[o*2]=Math.fround(t*a-e/2)+s,i[o*2+1]=Math.fround(-r)+0+c}}return i}function qb(e,t,n,r,i){let a=r+1,o=64/r;for(let s=0,c=0;s<65;s++){let l=Math.min(r-1,Math.floor(s/o)),u=s/o-l;for(let s=0;s<65;s++,c++){let d=Math.min(r-1,Math.floor(s/o)),f=s/o-d,p=(l*a+d)*t+n;i[c]=(e[p]*(1-f)+e[p+t]*f)*(1-u)+(e[p+a*t]*(1-f)+e[p+(a+1)*t]*f)*u}}return i}var Jb=(e,t,n,r,i)=>(e[t]*(1-i)+e[t+1]*i)*(1-r)+(e[t+n]*(1-i)+e[t+n+1]*i)*r;function Yb(e,t,n,r,i,a,o){let s=i*i,c=i-1,l=Math.hypot(a,o),u=new Float32Array(s),d=new Float32Array(s);for(let t=0;t<s;t++)u[t]=e[t*2],d[t]=e[t*2+1];let f=new Int32Array(s).fill(-1);for(let e=0;e<n.length;e++)f[n[e]]=e;let p=(e,n,i)=>{if(r[n]<0||f[n]>=f[e])return;let a=t[e]-t[n],o=Math.sqrt(Math.max(0,i*i-a*a)),s=u[e]-u[n],c=d[e]-d[n],l=Math.sqrt(s*s+c*c);l<=o||l===0||(u[e]=u[n]+s/l*o,d[e]=d[n]+c/l*o)};for(let e=0;e<2;e++)for(let e=1;e<n.length;e++){let t=n[e],r=t%i,s=(t-r)/i;r>0&&p(t,t-1,a),r<c&&p(t,t+1,a),s>0&&p(t,t-i,o),s<c&&p(t,t+i,o),s>0&&r>0&&p(t,t-i-1,l),s>0&&r<c&&p(t,t-i+1,l),s<c&&r>0&&p(t,t+i-1,l),s<c&&r<c&&p(t,t+i+1,l)}let m=new Float32Array(s*2);for(let t=0;t<s;t++)m[t*2]=u[t]-e[t*2],m[t*2+1]=d[t]-e[t*2+1];return m}var Xb=class{pieces=[];grids=g_();spread=new Float32Array(16384);gridsBelow=g_();gridsBelowOf=null;laidAlone=null;put=null;cellsMemo=new WeakMap;steepMemo=new WeakMap;lastStack=null;sliding=null;plateLog=[];laying=null;bends={...yv};shell=!1;fine=!1;fineInputs=null;coarseInputs=null;settles=0;firm=!1;get settleMark(){return{settles:this.settles,firm:this.firm}}set settleMark(e){this.settles=e.settles,this.firm=e.firm}shellRounds=60;bread=null;gridsUnder=g_();probe=!1;pose={h:0,ax:0,ay:0,capped:!1};centroids=new Map;covers(e,t,n){let r=t-e.x,i=n-e.y,a=Math.cos(-e.rot),o=Math.sin(-e.rot);return Sy(e.asset,(r*a-i*o)/e.w+e.cx,e.cy-(r*o+i*a)/e.h)}coversOnPlane(e,t,n,r,i,a=r*(t-e.x)+i*(n-e.y)){let[o,s]=U_(r,i,e.rot,t-e.x,n-e.y,a);return Sy(e.asset,o/e.w+e.cx,e.cy-s/e.h)}frameToWorld(e,t,n){let r=(t-e.cx)*e.w,i=-(n-e.cy)*e.h,a=Math.cos(e.rot),o=Math.sin(e.rot);return[e.x+r*a-i*o,e.y+r*o+i*a]}shapeCells(e,t,n){let r=e.asset.shape,i=Math.cos(e.rot),a=Math.sin(e.rot);return Float32Array.from(t,t=>this.shapeAt(e,f_(t),p_(t),n,r,i,a))}shapeAt(e,t,n,r,i=e.asset.shape,a=Math.cos(e.rot),o=Math.sin(e.rot)){let s=t-e.x,c=n-e.y;return J_(i,(s*a+c*o)/e.w+e.cx,e.cy-(-s*o+c*a)/e.h,r)}undersideAt(e,t,n){return e.base+e.ax*(t-e.x)+e.ay*(n-e.y)+e.lift}sunkAt(e,t,n){return e.sink?pg(e.give[t],e.sink,n):0}squashStack(e){let t=this.pieces.map(t=>{if(t.lift>0||t===e)return null;let n=this.cellsUnder(t),r=t.bears?.cells===n?t.bears.on:null;return r?n.filter((e,t)=>r[t]===1):n}),n=this.pieces.map(e=>({sink:e.sink??0,give:e.give?Float32Array.from(this.cellsUnder(e),t=>e.give[t]):null})),r=this.pieces.map(e=>$[e.type].thick/11),i=this.pieces.map(e=>e.give??=new Float32Array(16384)),a=new Float32Array(this.pieces.length),o=_g(t,r,i,a,16384,2/11,rg/11);return this.pieces.forEach((e,t)=>{let i=a[t],s=e.sink??0,c=e.borne;if(c&&i>0&&i<=c.even*1.5&&c.even<=i*1.5&&c.x===e.x&&c.y===e.y&&c.rot===e.rot){let r=n[t].give;r&&this.cellsUnder(e).forEach((t,n)=>void(e.give[t]=r[n]));return}let l=i>0?fg(i,o,$[e.type].squish):0;e.sink=l===0||s===0||Math.abs(l-s)*r[t]>uy?l:s,e.borne=i>0?{even:i,x:e.x,y:e.y,rot:e.rot}:void 0}),this.pieces.some((e,t)=>{let r=n[t];return e.sink!==r.sink||!r.give||this.cellsUnder(e).some((t,n)=>e.give[t]!==r.give[n])})}restsOn(e,t,n){return e[t]-this.sinkAt(t,e,n,nv)+(e[t]===this.spread[t]?iv:av)}sinkAt(e,t,n,r){let i=this.spread[e];return t[e]!==i||i<=zf?0:Math.min(r*(i-zf),rv*n)}slivers(e,t,n){let r=e.length,i=128,a=-1,o=128,s=-1;for(let t=0;t<r;t++){let n=e[t],r=n%128,c=(n-r)/128;r<i&&(i=r),r>a&&(a=r),c<o&&(o=c),c>s&&(s=c)}if(a<0)return;i=Math.max(0,i-4),o=Math.max(0,o-4),a=Math.min(127,a+4),s=Math.min(127,s+4);let c=a-i+1,l=s-o+1,u=c*l;w_.length<u&&(w_=new Float32Array(u),T_=new Float32Array(u));let d=w_,f=T_,p=this.spread;for(let e=0;e<l;e++)for(let n=0;n<c;n++){let r=(e+o)*128+n+i;d[e*c+n]=Math.max(0,t[r]-p[r])}Ov(d,f,c,l);for(let a=0;a<r;a++){let r=e[a],s=r%128-i,l=(r-r%128)/128-o;n[a]+=Math.max(0,t[r]-p[r])-d[l*c+s]}}cellsUnder(e){let t=this.cellsMemo.get(e);if(t&&t.x===e.x&&t.y===e.y&&t.rot===e.rot&&t.asset===e.asset)return t.cells;let n=[],[r,i,a,o]=Ub(e),s=Math.cos(-e.rot),c=Math.sin(-e.rot),l=e.asset;for(let t=a;t<=o;t++){let a=d_(t)-e.y;for(let o=r;o<=i;o++){let r=u_(o)-e.x;Sy(l,(r*s-a*c)/e.w+e.cx,e.cy-(r*c+a*s)/e.h)&&n.push(t*128+o)}}return this.cellsMemo.set(e,{x:e.x,y:e.y,rot:e.rot,asset:e.asset,cells:n}),n}ahead=null;topAhead(e,t,n){let r=this.ahead;if(!r)return n;for(let i of[.5,1]){let a=Math.round(r[0]*i*128),o=-Math.round(r[1]*i*128);if(a!==0||o!==0)for(let r=0;r<e.length;r++){let i=e[r],s=i%128+a,c=(i-i%128)/128+o;if(s<0||s>=128||c<0||c>=128)continue;let l=t[c*128+s];l>n&&(n=l)}}return n}gridLayers(e){if(!e.asset.layers)return null;if(!e.gridLayers){let t=e.rest;e.gridLayers=Float32Array.from({length:t.length/2},(n,r)=>this.layersAt(e,t[r*2],t[r*2+1]))}return e.gridLayers}layersAt(e,t,n){let r=e.asset;return r.layers?xy(r.layers,r.aw,r.ah,t/e.w+e.cx,e.cy-n/e.h):1}bendOf(e){let t=$[e.type];return(t.stiff??0)<.5&&t.plate!==void 0?this.bends[e.type]:0}*drape(e,t,n){let r=t.sup,i=t.flat,a=e.xyz,o=a.length/3,s=Math.cos(e.rot),c=Math.sin(e.rot),l=e.ground??=new Float32Array(o),u=this.gridLayers(e),d=$[e.type],f=d.stiff??0,p=this.bendOf(e),m=f>=.5?i:r,h=d.thick/11,g=1.5*Math.max(e.w,e.h)/64,_=Hb(e)+g,v=Math.max(0,Math.floor((e.x-_+.5)*128)),y=Math.min(127,Math.ceil((e.x+_+.5)*128)),b=Math.max(0,Math.floor((.5-e.y-_)*128)),x=Math.min(127,Math.ceil((.5-e.y+_)*128)),S=Math.max(0,y-v+1),C=(e=>{let t=new Float32Array(S*Math.max(0,x-b+1));for(let n=b;n<=x;n++)for(let r=v;r<=y;r++)t[(n-b)*S+(r-v)]=this.restsOn(e,n*128+r,h);return t})(m),w=(e,t)=>{let n=Math.floor((e+.5)*128),r=Math.floor((.5-t)*128);return n<v||r<b||n>y||r>x?av:C[(r-b)*S+(n-v)]},T=t=>Math.min(e.held?e.held[t]:1/0,a[t*3+2]+ry),E=p>0?this.lyingOn(e,t,n,w):null,D=e.shellRest?.rested===!1&&(!this.probe||e===this.pieces[this.pieces.length-1]),O=e.fineWarm&&e.fineWarm.x===e.x&&e.fineWarm.y===e.y&&e.fineWarm.rot===e.rot&&e.fineWarm.bend===p/11,k=D?void 0:e.draped?.open&&O&&!this.probe&&e.fineMemo?e.fineMemo:e.draped,A=Nb(p>0?p:f>=.5?d.cm/2:0);if(k&&this.firm&&k.fine&&e.fineIn===this.settles&&k.x===e.x&&k.y===e.y&&k.rot===e.rot&&k.bend===p&&(!E||k.loads&&Vb(k.loads,E.key,A,!0))){let r=new Int16Array(n.length);for(let e=0;e<n.length;e++)r[e]=t.owner[n[e]];if(k.under=C,k.owners=r,E){let e=new Map(k.loads.loads.map(e=>[e.id,e]));k.loads={sheet:E.key.sheet,loads:E.key.loads.map(t=>{let n=e.get(t.id);return n?{...t,mass:n.mass,at:n.at,reach:n.reach}:t})}}else for(let e=0;e<o;e++)k.held[e]=T(e);k.heldOut&&e.heldNext?.set(k.heldOut);return}let j=e.fineWarm,M=!this.fine&&!this.probe&&this.shell&&p>0&&!!j&&j.x===e.x&&j.y===e.y&&j.rot===e.rot&&j.bend===p/11,N=k?k.x!==e.x||k.y!==e.y||k.rot!==e.rot||k.bend!==p||k.shell!==this.shell?`pose`:(!k.fine||k.open)&&this.fine||!k.fine&&M?`kind`:Math.abs(k.yx-e.yield[0])<=iy&&Math.abs(k.yy-e.yield[1])<=iy?jb(k.under,C,A,k.reach)?null:`ground`:`yield`:D?`goesOn`:`none`;if(k&&N===null){let r=k.owners.length===n.length;for(let e=0;r&&e<n.length;e++)r=k.owners[e]===t.owner[n[e]];if(E){let e=!!k.loads&&Vb(k.loads,E.key,A);r&&=e}for(let e=0;r&&!E&&e<o;e++){let t=k.held[e],n=T(e);r=t===n||Math.abs(t-n)<=Zv}if(r){k.heldOut&&e.heldNext?.set(k.heldOut),k!==e.draped&&(e.draped=k,e.fineNow=!0,e.fineOpen=!1),e.memoMiss=void 0,p>0&&this.shell&&!this.probe&&!this.fine&&!k.fine&&!this.plateLog.some(t=>t.id===e.id)&&this.plateLog.push({id:e.id,type:e.type,loads:0,rounds:0,converged:!0,warm:!0,ms:0,coarseShell:!0});return}}let P=e.fineWarm;if(!this.fine&&!this.probe&&this.shell&&p>0&&k?.fine&&P&&P.x===e.x&&P.y===e.y&&P.rot===e.rot&&P.bend===p/11&&k.x===e.x&&k.y===e.y&&k.rot===e.rot&&k.bend===p){k.heldOut&&e.heldNext?.set(k.heldOut),this.plateLog.some(t=>t.id===e.id&&t.open)||this.plateLog.push({id:e.id,type:e.type,loads:0,rounds:0,converged:!0,warm:!0,ms:0,open:!0});return}let F=new Int16Array(n.length);for(let e=0;e<n.length;e++)F[e]=t.owner[n[e]];let I=new Float32Array(o);this.unrest(e);let ee=this.pose,te=null,L=null;if(f>=.5&&n.length>0){let r=new Float32Array(n.length);for(let e=0;e<n.length;e++){let t=n[e];r[e]=m[t]-w(f_(t),p_(t))}this.restPiece(e,n,m,t.owner,r,h,void 0,!0),te=new Float32Array(o),L=new Float32Array(o)}let R=h+zv/f,z=e.rest,B=Sb(C,S,2*g,v,b,y,x);for(let t=0;t<o;t++){let n=z[t*2],r=z[t*2+1],i=e.x+n*s-r*c,a=e.y+n*c+r*s,o=B(i,a);I[t]=o+h,l[t]=o,te&&(te[t]=Cm(ee,e.com[0],e.com[1],i,a)+R,I[t]>te[t]&&(I[t]=te[t],l[t]=-1),L[t]=I[t]-te[t])}L&&tb(L,e.asset,65);let ne=.0013*Math.max(.05,1-f*.6),V,H=null,re=null,ie=null,ae=L??I,oe=Math.max(4,Math.round(64/(1+f*5))),se=p/11;if(se>0){let t=Sb(C,S,g,v,b,y,x),n=new Float32Array(o),r=new Float64Array(o),i=new Float64Array(o),a=(a,l=null)=>{for(let l=0;l<o;l++){let o=z[l*2]+(a?a[l*2]:0),u=z[l*2+1]+(a?a[l*2+1]:0);r[l]=e.x+o*s-u*c,i[l]=e.y+o*c+u*s,n[l]=t(r[l],i[l])+h}return ie=new Float32Array(o),re=new Float32Array(o),this.plateOn(e,n,se,E,r,i,a?`drawn`:`flat`,ie,re,l)};V=a(null);let l=null;if(E.pieces.length===0){let t=this.stickHeld(e,r,i,w,h);if(t&&(this.liftsOff(V,t)||this.hangsOff(e,V,t,r,i))){e.stuck=!0;let n=t.cx-e.x,a=t.cy-e.y;e.hold=[n*s+a*c,-n*c+a*s],l=t.mask,this.tipsOf(e,t,r,i)}}if(this.shell){ie=new Float32Array(o),re=new Float32Array(o);let n=yield*this.shellOn(e,C,S,v,b,x,g,se,E,t,r,i,ie,re,l);V=n.z,H=n.shift}else{l&&(V=a(null,l));let t=e.stuck?null:this.unstretch(e,V);t&&Tb(t)>wv&&(V=a(t))}}else if(oe<64){let e=oe+1,t=64/oe,n=new Float32Array(e*e),r=Math.ceil(t);for(let i=0;i<e;i++)for(let a=0;a<e;a++){let o=Math.round(i*t),s=Math.round(a*t),c=-1/0;for(let e=Math.max(0,o-r);e<=Math.min(64,o+r);e++)for(let t=Math.max(0,s-r);t<=Math.min(64,s+r);t++){let n=ae[e*65+t];n>c&&(c=n)}n[i*e+a]=c}let i=rb(n,e,ne*t*t,60,te?null:void 0);V=new Float32Array(o);for(let n=0,r=0;n<65;n++){let a=Math.min(oe-1e-6,n/t),o=Math.floor(a),s=a-o;for(let n=0;n<65;n++,r++){let a=Math.min(oe-1e-6,n/t),c=Math.floor(a),l=a-c,u=i[o*e+c],d=i[o*e+c+1],f=i[(o+1)*e+c],p=i[(o+1)*e+c+1],m=(u*(1-l)+d*l)*(1-s)+(f*(1-l)+p*l)*s,h=ae[r];V[r]=m>h?m:h}}V=rb(ae,65,0,Math.round(t*1.5),V),te&&(V=nb(V,ae,Uv/f,65))}else V=rb(ae,65,ne,90);if(te&&L){for(let e=0;e<o;e++)V[e]>0&&(V[e]=0);wb(V,65,e.w/64,e.h/64,Hv(f)),Cb(V,L,65,Math.round(qv*f));let t=Math.hypot(e.ax,e.ay),n=t>0?Math.sin(Math.min(Math.atan(t),Hv(f)))/t:0;for(let e=0;e<o;e++)V[e]=V[e]+te[e]+(te[e]-R-ee.h)*(n-1);if(Math.atan(t)>Hv(f)){let t=ub(e.asset,65),n=0;for(let r=0;r<o;r++){if(!t[r])continue;let i=e.x+z[r*2]*s-z[r*2+1]*c,a=e.y+z[r*2]*c+z[r*2+1]*s,o=Math.min(w(i,a)+h,te[r])-V[r];o>n&&(n=o)}if(n>0)for(let e=0;e<o;e++)V[e]+=n}}let ce=f<.5&&se===0?this.hang(e,V,I,l,()=>Sb(C,S,g,v,b,y,x),h):null,le=ce??H??(e.stuck?null:this.unstretch(e,V));if(te&&(e.tips=this.slabTips(e,V,le,w,h+zv/f)),f<.5&&!ce){let t=ub(e.asset,65),n=!1;for(let r=0;r<o;r++){if(!t[r])continue;let i=z[r*2]+(le?le[r*2]:0),a=z[r*2+1]+(le?le[r*2+1]:0),o=w(e.x+i*s-a*c,e.y+i*c+a*s);V[r]<o+h&&(V[r]=o+h,I[r]=V[r],l[r]=o,H_[r]=1,n=!0)}if(n){let n=Math.tan(Vv),r=e.w/64*n,i=e.h/64*n,a=(e,n,r)=>!H_[e]||!t[n]||V[n]>=V[e]-r?!1:(V[n]=V[e]-r,H_[n]=1,!0);for(let e=0,n=!0;n&&e<65;e++){n=!1;for(let e=0;e<o;e++)t[e]&&(e%65<64&&a(e,e+1,r)&&(n=!0),e+65<o&&a(e,e+65,i)&&(n=!0));for(let e=o-1;e>=0;e--)t[e]&&(e%65>0&&a(e,e-1,r)&&(n=!0),e>=65&&a(e,e-65,i)&&(n=!0))}}H_.fill(0)}let U=e.steep=ce?Cy(z,ce,65,e.w/64,e.h/64):null;if(re)for(let e=0;e<o;e++)V[e]>re[e]&&(V[e]=re[e]);let ue=ie&&u?ky(ie,65,e.w/64,e.h/64):null;if(e.held&&se===0){let t=null;if(f<.5){t=new Float32Array(o);for(let n=0;n<o;n++){let r=z[n*2]+(le?le[n*2]:0),a=z[n*2+1]+(le?le[n*2+1]:0),o=m_(e.x+r*s-a*c,e.y+r*c+a*s);t[n]=U?.[n]?I[n]:this.restsOn(i,o,h)+h}}Ay(V,e.held,I,u,h,65,t,h*d.squish)}for(let e=0;e<o;e++)a[e*3]=z[e*2]+(le?le[e*2]:0),a[e*3+1]=z[e*2+1]+(le?le[e*2+1]:0),a[e*3+2]=V[e];if(u){let t=Gb(a,65),n=e.fold?.length===a.length?e.fold:e.fold=new Float32Array(a.length);for(let e=0;e<o;e++){let r=Ey(u,e,h),i=ue?Oy(r,ue[e],V[e],h):r;for(let r=0;r<3;r++)n[e*3+r]=i*t[e*3+r],a[e*3+r]=a[e*3+r]+i*t[e*3+r]}}else e.fold=null;let de=ie;if(de){for(let e=0;e<o;e++)de[e]>a[e*3+2]+ry&&(de[e]=1/0);e.heldNext?.set(de)}let fe=new Float32Array(o);for(let e=0;e<o;e++)fe[e]=T(e);e.draped={x:e.x,y:e.y,rot:e.rot,yx:e.yield[0],yy:e.yield[1],bend:p,shell:this.shell,fine:this.shell&&!!e.fineNow,open:this.shell&&!!e.fineOpen,reach:Mb(n,v,b,S,C.length/Math.max(1,S),Math.ceil(g*128)+2),under:C,owners:F,held:fe,...de?{loads:E.key,heldOut:de}:{}},e.draped.fine&&!e.draped.open&&(e.fineMemo=e.draped),e.shift=le,e.shiftMax=le?Tb(le):0,e.flatAt=null,e.ver++}tipsOf(e,t,n,r){let[i,a]=this.frameToWorld(e,e.comX,e.comY),o=[];for(let e=0;e<65;e++){let i=-1,a=-1;for(let n=0;n<65;n++)t.mask[e*65+n]&&(i<0&&(i=e*65+n),a=e*65+n);i<0||(o.push([n[i],r[i]]),a!==i&&o.push([n[a],r[a]]))}if(bm(ym(o),i,a)<this.edgeOf(e)){let n=Math.hypot(i-t.cx,a-t.cy);e.tips=n>1e-9?[(i-t.cx)/n,(a-t.cy)/n]:[0,1]}}*shellOn(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m){let h=4225,g=Cv,_=64/g,v=$[e.type].thick/11,y=this.gridLayers(e),b=ub(e.asset,65),x=ub(e.asset,13),S=Math.cos(e.rot),C=Math.sin(e.rot),w=e.rest,T=performance.now(),E=Math.max(0,a-i+1),D=xb(t,n,E,Math.max(1,Math.round((o/2+Math.max(e.w,e.h)/g/2)*128))+2);for(let e=0;e<D.length;e++)D[e]+=v;let O={data:D,nx:n,ny:E,x0:(r+.5)/128-.5,y0:.5-(i+.5)/128,sx:1/128,sy:-1/128},k=new Float64Array(338);for(let t=0;t<13;t++)for(let n=0;n<13;n++)k[(t*13+n)*2]=(n/g-e.cx)*e.w,k[(t*13+n)*2+1]=(e.cy-t/g)*e.h;let A=m&&e.hold?[e.hold[0]/e.w+e.cx,e.cy-e.hold[1]/e.h]:[e.comX,e.comY],j=Math.min(g,Math.max(0,Math.round(A[1]*g)))*13+Math.min(g,Math.max(0,Math.round(A[0]*g)));e.shellRest?.seg!==g&&(e.shellRest=void 0);let M=e.shellRest,N=e.shift;for(let t=0;t<h;t++){let n=w[t*2]+(N?N[t*2]:0),r=w[t*2+1]+(N?N[t*2+1]:0);u[t]=e.x+n*S-r*C,d[t]=e.y+n*C+r*S}let P=this.loadsOn(e,c,x,13,_,u,d,v,y,M?.poses??null),F=m?this.stickLoad(m,x,13,_,u,d):null,I=F?[...P,F]:P,ee={cols:13,hx:e.w/g,hy:e.h/g,rest:k,own:x,x:e.x,y:e.y,rot:e.rot,bend:s,stretch:Qm(s,v),anchor:j},te={last:M?.warm??null},L=new Float64Array(507),R=new Float64Array(I.length*3);if(!te.last||te.last.x.length!==hh(13,I)){let t=new Float64Array(3),n=new Float32Array(169);for(let r=0;r<169;r++)oh(O,e.x+k[2*r]*S-k[2*r+1]*C,e.y+k[2*r]*C+k[2*r+1]*S,t),n[r]=t[0];let r=this.restWithLoads(e,I,n,x,13,s,{rounds:0,converged:!1},{last:null});for(let e=0;e<169;e++)L[3*e]=k[2*e],L[3*e+1]=k[2*e+1],L[3*e+2]=r[e]}I.forEach((e,t)=>R.set([e.h,e.ax,e.ay],3*t));let z={rounds:0,converged:!1},B=[];this.coarseInputs?.set(e.id,{sheet:{...ee},floor:O,loads:I.map(e=>({...e})),start:{xyz:L.slice(),planes:R.slice()},warm:te.last?te.last.x.slice():null,most:this.shellRounds});let ne=vh(ee,O,I,{xyz:L,planes:R},B,z,te,this.shellRounds),V=ne.next();for(;!V.done;)te.last&&(e.shellRest={seg:g,warm:te.last,poses:M?.poses??new Map,rested:!1}),yield,V=ne.next();let H=V.value;I.forEach((e,t)=>{let n=B[t];n.h>-1/0&&(e.h=n.h,e.ax=n.ax,e.ay=n.ay)}),e.shellRest={seg:g,warm:te.last,poses:new Map(P.map((e,t)=>[c.pieces[t].q.id,[e.h,e.ax,e.ay]])),rested:z.converged};let re=qb(H,3,0,g,new Float64Array(h)),ie=qb(H,3,1,g,new Float64Array(h)),ae=qb(H,3,2,g,new Float64Array(h)),oe=P,se=e=>H[3*e+2],ce=e.fineWarm,le=ce?Math.abs(((ce.rot-e.rot)%(2*Math.PI)+3*Math.PI)%(2*Math.PI)-Math.PI):1/0,U=!this.probe&&ce&&Math.hypot(ce.x-e.x,ce.y-e.y)<=Ib&&le<=Lb&&ce.bend===s?ce:null,ue=this.fine||!!U;if(e.fineNow=ue,e.fineOpen=ue&&!this.fine,!ue)this.plateLog.push({id:e.id,type:e.type,loads:P.length,rounds:z.rounds,converged:z.converged,warm:z.warm??!1,ms:performance.now()-T,coarseShell:!0});else{let r=performance.now(),i=xb(t,n,E,Math.max(1,Math.round(o/2*128))+2);for(let e=0;e<i.length;e++)i[e]+=v;let a={...O,data:i},l=U?U.xyz.slice():new Float64Array(h*3);for(let t=0;t<h;t++)U||(l[3*t]=re[t],l[3*t+1]=ie[t],l[3*t+2]=ae[t]),u[t]=e.x+l[3*t]*S-l[3*t+1]*C,d[t]=e.y+l[3*t]*C+l[3*t+1]*S;let f=U?new Map([...e.shellRest.poses,...U.planes]):e.shellRest.poses,p=this.loadsOn(e,c,b,65,1,u,d,v,y,f),g=m?this.stickLoad(m,b,65,1,u,d):null,_=g?g.on.v:null,x=p,D=new Float64Array(x.length*3);x.forEach((e,t)=>D.set([e.h,e.ax,e.ay],3*t));let k=Math.min(64,Math.max(0,Math.round(A[1]*64)))*65+Math.min(64,Math.max(0,Math.round(A[0]*64))),j={cols:65,hx:e.w/64,hy:e.h/64,rest:w,own:b,x:e.x,y:e.y,rot:e.rot,bend:s,stretch:Qm(s,v),anchor:k},M={rounds:0,converged:!1,cg:0},N=[];this.fineInputs?.set(e.id,{sheet:j,floor:a,loads:x.map(e=>({...e})),start:{xyz:l.slice(),planes:D.slice(),pins:_?Array.from(_):null,rested:!!U}});let P=this.fine,F=P?yield*ng(j,a,x,{xyz:l,planes:D,pins:_,rested:!!U},N,M):l;P?x.forEach((e,t)=>{let n=N[t];n.h>-1/0&&(e.h=n.h,e.ax=n.ax,e.ay=n.ay)}):x.forEach(e=>{let t=-1/0;for(let n=0;n<e.on.v.length;n++)t=Math.max(t,F[3*e.on.v[n]+2]+e.on.off[n]-e.ax*(e.on.x[n]-e.cx)-e.ay*(e.on.y[n]-e.cy));for(let n=0;n<e.under.c.length;n++)t=Math.max(t,e.under.c[n]-e.ax*(e.under.x[n]-e.cx)-e.ay*(e.under.y[n]-e.cy));t>e.h&&(e.h=t+wh/10)}),re=new Float64Array(h),ie=new Float64Array(h),ae=new Float64Array(h);for(let e=0;e<h;e++)re[e]=F[3*e],ie[e]=F[3*e+1],ae[e]=F[3*e+2];oe=p,se=e=>F[3*e+2],e.shellRest.rested=!0,P?(e.fineIn=this.settles,e.fineWarm={x:e.x,y:e.y,rot:e.rot,bend:s,xyz:F.slice(),planes:new Map(p.map((e,t)=>[c.pieces[t].q.id,[e.h,e.ax,e.ay]]))},M.ms,this.plateLog.push({id:e.id,type:e.type,loads:p.length,rounds:M.rounds,converged:M.converged,warm:!!U,ms:performance.now()-r,fine:!0})):this.plateLog.some(t=>t.id===e.id&&t.open)||this.plateLog.push({id:e.id,type:e.type,loads:p.length,rounds:0,converged:!0,warm:!0,ms:performance.now()-T,open:!0})}e.touching=x_(c,oe,se);let de=new Float32Array(h),fe=new Float32Array(h*2),W=new Float32Array(h);for(let t=0;t<h;t++){let n=re[t],r=ie[t];de[t]=ae[t],fe[t*2]=n-w[t*2],fe[t*2+1]=r-w[t*2+1],u[t]=e.x+n*S-r*C,d[t]=e.y+n*C+r*S,W[t]=l(u[t],d[t])+v}f.fill(1/0),this.heldBy(e,c,oe,u,d,v,y,f);let pe=new Float32Array(h);for(let e=0;e<h;e++)p[e]=b[e]?f[e]-Ty(Ey(y,e,v),v):1/0,pe[e]=b[e]?Math.min(W[e],p[e]):-1/0,de[e]=Math.min(p[e],Math.max(de[e],pe[e]));let me=ue?de:rb(pe,65,0,Math.round(_*1.5),de);for(let e=0;e<h;e++)me[e]>p[e]&&(me[e]=p[e]);return{z:me,shift:fe}}plateOn(e,t,n,r,i,a,o,s,c,l=null){let u=4225,d=Math.max(e.w,e.h)/xv>n/2?Sv:xv,f=d+1,p=64/d,m=$[e.type].thick/11,h=this.gridLayers(e),g=ub(e.asset,65),_=new Float32Array(u);for(let e=0;e<u;e++)_[e]=g[e]?t[e]:-1/0;let v=new Float32Array(f*f);for(let e=0;e<f;e++)for(let n=0;n<f;n++){let r=-1/0;for(let t=Math.max(0,Math.ceil(e*p-p/2));t<=Math.min(64,Math.floor(e*p+p/2));t++)for(let e=Math.max(0,Math.ceil(n*p-p/2));e<=Math.min(64,Math.floor(n*p+p/2));e++){let n=_[t*65+e];n>r&&(r=n)}v[e*f+n]=r>-1/0?r:t[Math.round(e*p)*65+Math.round(n*p)]}let y=ub(e.asset,f);e.plate?.seg!==d&&(e.plate={seg:d,flat:null,drawn:null});let b=e.plate[o],x=this.loadsOn(e,r,y,f,p,i,a,m,h,b?.poses??null),S=l?this.stickLoad(l,y,f,p,i,a):null,C=performance.now(),w={rounds:0,converged:!1},T={last:b?.warm??null},E=this.restWithLoads(e,S?[...x,S]:x,v,y,f,n,w,T,S?my:void 0);this.plateLog.push({id:e.id,type:e.type,loads:x.length,rounds:w.rounds,converged:w.converged,warm:w.warm??!1,ms:performance.now()-C}),e.plate[o]={z:E,poses:new Map(x.map((e,t)=>[r.pieces[t].q.id,[e.h,e.ax,e.ay]])),warm:T.last},e.touching=x_(r,x,e=>E[e]),s.fill(1/0),this.heldBy(e,r,x,i,a,m,h,s);for(let e=0;e<u;e++)c[e]=g[e]?s[e]-Ty(Ey(h,e,m),m):1/0,_[e]=g[e]?Math.min(t[e],c[e]):-1/0;let D=qb(E,1,0,d,new Float64Array(u)),O=new Float32Array(u);for(let e=0;e<u;e++){let t=D[e];O[e]=Math.min(c[e],t>_[e]?t:_[e])}let k=rb(_,65,0,Math.round(p*1.5),O);for(let e=0;e<u;e++)k[e]>c[e]&&(k[e]=c[e]);return k}drawnForTouch(e){for(let e of _b)gb[e]=-1/0;if(_b.length=0,e.xyz.length!==12675)return null;vb(e);let{cells:t,tops:n}=e.drawn,r=-1/0;for(let e=0;e<t.length;e++)gb[t[e]]=n[e],_b.push(t[e]),n[e]>r&&(r=n[e]);return{top:r}}touchGap(e,t,n,r,i,a){if(!r)return-1/0;let o=$[t.type],s=0;for(let e of i)s+=Dy($[e.type].thick/11,e.asset.layers?ay:1);if(t.base+t.lift-(Math.abs(t.ax)+Math.abs(t.ay))*Hb(t)-s-r.top>Qv)return 1/0;let c=o.shape?t.asset.shape:null,l=Math.cos(t.rot),u=Math.sin(t.rot),d=1/0;for(let r of n){if(gb[r]===-1/0||r%2||Math.floor(r/128)%2)continue;let n=f_(r),o=p_(r),s=this.undersideAt(t,n,o)+(c?this.shapeAt(t,n,o,`bot`,c,l,u):0)+this.sunkAt(e,r,a)-this.betweenAt(i,i.length,n,o);s-gb[r]<d&&(d=s-gb[r])}return d}topAt(e,t,n,r){let i=$[e.type],a=i.shape?e.asset.shape:null,o=Math.cos(e.rot),s=Math.sin(e.rot),c=a?this.shapeAt(e,t,n,`bot`,a,o,s):0,l=a?this.shapeAt(e,t,n,`top`,a,o,s):i.thick/11;return this.undersideAt(e,t,n)+l-this.sunkAt(e,r,l-c)}lyingOn(e,t,n,r){let i=t.flat,a=this.pieces.indexOf(e)+1,o=$[e.type].thick/11,s=[],c=[],l=[],u=new Set(n),d=(e,t)=>Math.hypot(e.x-t.x,e.y-t.y)<=Hb(e)+Hb(t),f=this.drawnForTouch(e),p=e.touching,m=new Set;for(let t of e.draped?.loads?.loads??[])m.add(t.id);let h=[],g=e=>e.set??=new Set(e.cells);for(let t=a;t<this.pieces.length;t++){let n=this.pieces[t];if(n.lift>0||n===this.laying||!n.stackLaid)continue;let a=$[n.type];if(a.drape&&(a.stiff??0)<.5){d(n,e)&&(c.push(n),l.push({id:n.id,mass:0,vals:Float32Array.of(n.x,n.y,n.rot)}));continue}let _=this.cellsUnder(n);if(!(d(n,e)&&_.some(e=>u.has(e))&&(p?.has(n.id)||this.touchGap(e,n,_,f,c,o)<=(m.has(n.id)?$v:Qv)))){h.push({q:n,cells:_,set:null,e:-1});continue}let v=a.thick/11,y=a.shape?this.shapeCells(n,_,`bot`):new Float32Array(_.length);for(let e=0;e<_.length;e++)y[e]+=this.sinkAt(_[e],i,v,tv);this.slivers(_,i,y);let b=[],x=[],S=[],C=new Map,w=new Set;for(let t=0;t<_.length;t++){let a=_[t];if(a%4||Math.floor(a/128)%4)continue;let l=f_(a),u=p_(a),f=i[a];this.covers(e,l,u)&&(f=Math.max(f,r(l,u)+o+Ty(o*(this.layersAtWorld(e,l,u)-1),o))),b.push(l),x.push(u),S.push(f+this.betweenAt(c,c.length,l,u)-y[t]);let p=h.length-1;for(;p>=0&&!(d(n,h[p].q)&&g(h[p]).has(a));)p--;if(p<0)continue;let m=h[p].e;if(m<0){let e=h[p].q;S[S.length-1]=Math.max(S[S.length-1],this.topAt(e,l,u,a)-y[t]),w.add(e);continue}let v=s[m],T=v.top(l,u),E=C.get(m);E||C.set(m,E={px:[],py:[],pd:[]}),E.px.push(l),E.py.push(u),E.pd.push(T-this.sunkAt(v.q,a,T-v.bot(l,u))-y[t])}let T=Pb(b,x,S),E={x:T.x,y:T.y,c:T.z},D=[],O=[...C.entries()].sort((e,t)=>e[0]-t[0]),k=ey+S.length;for(let[e,{px:t,py:n,pd:r}]of O){let i=Pb(t,n,r);D.push({load:e,x:i.x,y:i.y,d:i.z}),k+=2+r.length}let A=new Float32Array(k);A.set([n.x,n.y,n.rot,(n.sink??0)*v,n.mass,S.length]),A.set(S,ey);let j=ey+S.length;for(let[e,{pd:t}]of O)A[j]=s[e].q.id,A[j+1]=t.length,A.set(t,j+2),j+=2+t.length;let M=a.shape?n.asset.shape:null,N=Math.cos(n.rot),P=Math.sin(n.rot);s.push({q:n,set:new Set(_),under:E,over:D,rests:[...w],bot:M?(e,t)=>this.shapeAt(n,e,t,`bot`,M,N,P):()=>0,top:M?(e,t)=>this.shapeAt(n,e,t,`top`,M,N,P):()=>v,between:c.length,mass:n.mass,cx:n.com[0],cy:n.com[1]}),h.push({q:n,cells:_,set:s[s.length-1].set,e:s.length-1}),l.push({id:n.id,mass:n.mass,vals:A})}let _=new Map;for(let{q:e}of h)_.set(e,[e.mass,e.mass*e.com[0],e.mass*e.com[1]]);for(let e=h.length-1;e>=0;e--){let t=h[e];t.e<0&&b_(t.q,_.get(t.q),_)}let v=new Map(l.map(e=>[e.id,e]));for(let e=0;e<s.length;e++){let t=s[e],[n,r,i]=_.get(t.q);if(n<=0)continue;t.mass=n,t.cx=r/n,t.cy=i/n;let a=v.get(t.q.id);a.mass=n,a.at=[t.cx,t.cy],a.reach=Hb(t.q)}let y=[];if(e.sink&&e.give)for(let t of n)y.push(this.sunkAt(e,t,Dy(o,this.layersAtWorld(e,f_(t),p_(t)))));let b=-1;return l.forEach((e,t)=>void(e.mass>0&&(b=t))),{pieces:s,between:c,key:{loads:l.filter((e,t)=>e.mass>0||t<b),sheet:Float32Array.from(y)}}}layersAtWorld(e,t,n,r=Math.cos(-e.rot),i=Math.sin(-e.rot)){if(!e.asset.layers)return 1;let a=t-e.x,o=n-e.y;return this.layersAt(e,a*r-o*i,a*i+o*r)}betweenAt(e,t,n,r){let i=0;for(let a=0;a<t;a++){let t=e[a];this.covers(t,n,r)&&(i+=Dy($[t.type].thick/11,this.layersAtWorld(t,n,r)))}return i}loadsOn(e,t,n,r,i,a,o,s,c,l){let u=e.w/(r-1),d=e.h/(r-1),f=s*u*d,p=[],{pieces:m,between:h}=t;for(let t of m){let g=t.q,[_,v,y]=l?.get(g.id)??[zf,0,0],b=$[g.type],x=b.drape&&(b.stiff??0)>=.5,S=[],C=[],w=[],T=[];for(let l=0;l<r;l++)for(let f=0;f<r;f++){let p=l*r+f;if(!n[p])continue;let{i:_,x:b,y:E}=by(l,f,i,a,o);if(!(this.covers(g,b,E)||this.covers(g,b+u/2,E)||this.covers(g,b-u/2,E)||this.covers(g,b,E+d/2)||this.covers(g,b,E-d/2))||x&&!this.coversOnPlane(g,b,E,v,y))continue;let D=!1;for(let e=0;e<t.over.length&&!D;e++)D=this.covers(m[t.over[e].load].q,b,E);for(let e=0;e<t.rests.length&&!D;e++)D=this.covers(t.rests[e],b,E);if(D)continue;let O=m_(b,E),k=c?c[_]:1;S.push(p),C.push(b),w.push(E),T.push(Ty(s*(k-1),s)+this.betweenAt(h,t.between,b,E)-t.bot(b,E)-this.sunkAt(e,O,Dy(s,k)))}p.push({weight:t.mass/f,cx:t.cx,cy:t.cy,slab:x,on:{v:Int32Array.from(S),x:Float64Array.from(C),y:Float64Array.from(w),off:Float64Array.from(T)},under:t.under,over:t.over,h:_,ax:v,ay:y})}return p}restWithLoads(e,t,n,r,i,a,o,s,c){let l=i-1,u=e.w/l,d=e.h/l,f=[],p=Vm(n,r,i,u,d,a,t,f,o,s,c);return t.forEach((e,t)=>{let n=f[t];n.h>-1/0&&(e.h=n.h,e.ax=n.ax,e.ay=n.ay)}),p}stickLoad(e,t,n,r,i,a){let o=[],s=[],c=[],l=0;for(let u=0;u<n;u++)for(let d=0;d<n;d++){let f=u*n+d;if(!t[f])continue;l++;let{i:p,x:m,y:h}=by(u,d,r,i,a);e[p]&&(o.push(f),s.push(m),c.push(h))}return o.length===0?null:{weight:4*l,cx:s.reduce((e,t)=>e+t,0)/o.length,cy:c.reduce((e,t)=>e+t,0)/o.length,slab:!1,on:{v:Int32Array.from(o),x:Float64Array.from(s),y:Float64Array.from(c),off:new Float64Array(o.length)},under:{x:new Float64Array,y:new Float64Array,c:new Float64Array},over:[],h:zf,ax:0,ay:0}}heldBy(e,t,n,r,i,a,o,s){let c=ub(e.asset,65),{pieces:l,between:u}=t,d=l.map(e=>Hb(e.q));for(let t=0;t<s.length;t++){if(!c[t])continue;let f=r[t],p=i[t];for(let r=0;r<l.length;r++){let i=l[r];if(Math.abs(f-i.q.x)>d[r]||Math.abs(p-i.q.y)>d[r])continue;let c=n[r];if(c.on.v.length===0||!(c.slab?this.coversOnPlane(i.q,f,p,c.ax,c.ay):this.covers(i.q,f,p)))continue;let m=o?o[t]:1,h=Cm(c,c.cx,c.cy,f,p)+i.bot(f,p)+this.sunkAt(e,m_(f,p),Dy(a,m))-this.betweenAt(u,i.between,f,p);h<s[t]&&(s[t]=h)}}}hang(e,t,n,r,i,a){let o=4225,s=e.w/64,c=e.h/64,l=ov*ov-1,u=this.hangLive(e);if(!yb(t,u,65,s,c,l))return null;let d=e.fell;if(d&&d.x===e.x&&d.y===e.y&&d.rot===e.rot&&Db(d.z,t,Zv)&&Db(d.floor,n,Zv))return d.shift?(t.set(d.zOut),n.set(d.floorOut),r.set(d.groundOut),d.shift):null;let f=Float32Array.from(t),p=Float32Array.from(n),m=i=>(e.fell={x:e.x,y:e.y,rot:e.rot,z:f,floor:p,shift:i,zOut:Float32Array.from(t),floorOut:Float32Array.from(n),groundOut:Float32Array.from(r)},i),h=$[e.type].bend??fv,g=new Int32Array(o).fill(-1),_=new Int32Array(o),v=[],y=[],b=0;for(let e=0;e<o;e++)b+=u[e];let x=e=>u[e]===1&&t[e]<=n[e]+uv,S=(e,n,r,i,a)=>g[n]!==-1||!x(n)||(t[n]-t[e])**2>l*r*r?a:(g[n]=i,_[a]=n,a+1);for(let e=0;e<o;e++){if(g[e]!==-1||!x(e))continue;let n=v.length,r=0,i=0;g[e]=n,_[r++]=e;for(let e=0;e<r;e++){let a=_[e];i+=t[a];let o=a%65,l=(a-o)/65;o>0&&(r=S(a,a-1,s,n,r)),o<64&&(r=S(a,a+1,s,n,r)),l>0&&(r=S(a,a-65,c,n,r)),l<64&&(r=S(a,a+65,c,n,r))}v.push(r),y.push(i/r)}let C=-1;for(let e=0;e<v.length;e++)v[e]<b*mv||(C<0||y[e]>y[C])&&(C=e);if(C<0&&v.length>0&&(C=v.indexOf(Math.max(...v))),C<0)return m(null);let w=e.rest,T=Math.cos(e.rot),E=Math.sin(e.rot),D=i(),O=(t,n)=>D(e.x+t*T-n*E,e.y+t*E+n*T)+a,k=new Float32Array(o),A=new Float32Array(o),j=new Float32Array(o),M=new Uint8Array(o),N=-1/0;for(let e=0;e<o;e++)g[e]===C&&t[e]>N&&(N=t[e]);for(let e=0;e<o;e++)k[e]=w[e*2],A[e]=w[e*2+1],g[e]===C||!u[e]?(j[e]=t[e],M[e]=1):j[e]=Math.max(N,O(k[e],A[e]));let P=[];for(let e=0;e<o;e++)g[e]===C&&P.push(e);let{order:F,depth:I,tail:ee}=bb(u,65,P),te=ee;for(let e=0;e<o;e++)u[e]&&I[e]===-1&&(F[te++]=e);let L=(e,t,n,r=dv)=>{if(!u[e]||!u[t])return;let i=k[t]-k[e],a=A[t]-A[e],o=j[t]-j[e],s=Math.sqrt(i*i+a*a+o*o),c=s>n?n:s<n*r?n*r:s;if(c===s||s===0)return;let l=M[e]||!M[t]&&I[e]<I[t]?0:1,d=M[t]||!M[e]&&I[t]<I[e]?0:1;if(l+d===0)return;let f=(s-c)/s/(l+d);k[e]+=i*f*l,A[e]+=a*f*l,j[e]+=o*f*l,k[t]-=i*f*d,A[t]-=a*f*d,j[t]-=o*f*d},R=new Float32Array(o),z=new Float32Array(o),B=new Float32Array(o),ne=new Float32Array(o);for(let e=0;e<o;e++)ne[e]=u[e]?O(k[e],A[e]):n[e];for(let e=0;e<sv;e++){for(let e=0;e<te;e++){let t=F[e];R[t]=k[t],z[t]=A[t],B[t]=j[t],M[t]||(j[t]-=cv)}for(let e=0;e<te;e++){let t=F[e];if(M[t])continue;let n=t%65,r=(t-n)/65;n>0&&L(t-1,t,s),n<64&&L(t,t+1,s),r>0&&L(t-65,t,c),r<64&&L(t,t+65,c),n>1&&L(t-2,t,2*s,h),n<63&&L(t,t+2,2*s,h),r>1&&L(t-130,t,2*c,h),r<63&&L(t,t+130,2*c,h)}let e=!1;for(let t=0;t<te;t++){let n=F[t];if(M[n])continue;let r=O(k[n],A[n]);j[n]<r&&(j[n]<r-a&&ne[n]<r-a&&(k[n]=R[n],A[n]=z[n],r=ne[n]),j[n]<r&&(j[n]=r)),ne[n]=r,j[n]<=r+lv?M[n]=1:Math.abs(j[n]-B[n])+Math.abs(k[n]-R[n])+Math.abs(A[n]-z[n])>cv*.05&&(e=!0)}if(!e)break}let V=e=>u[e]===1&&g[e]!==C&&j[e]>ne[e]+lv;for(let e=0;e<vv;e++)for(let e=0;e<te;e++){let t=F[e];if(!V(t))continue;let n=t%65,r=(t-n)/65,i=0,a=0,o=0,s=0;for(let e=0;e<4;e++){let c=e===0?n>0?t-1:-1:e===1?n<64?t+1:-1:e===2?r>0?t-65:-1:r<64?t+65:-1;c<0||!u[c]||(i+=k[c]-w[c*2],a+=A[c]-w[c*2+1],o+=j[c],s++)}if(s<3)continue;let c=(k[t]+w[t*2]+i/s)/2,l=(A[t]+w[t*2+1]+a/s)/2,d=(j[t]+o/s)/2,f=O(c,l);f>j[t]+lv||(k[t]=c,A[t]=l,j[t]=Math.max(d,f))}for(let e=0;e<o;e++)M[e]=+(g[e]===C||!u[e]);let H=F.subarray(0,te);wy(k,A,j,M,u,H,65,s,c,O,ne);for(let e=0;e<vv;e++)for(let e=0;e<te;e++){let t=F[e];if(!V(t))continue;let n=t%65,r=(t-n)/65,i=0,a=0;n>0&&u[t-1]&&(i+=j[t-1],a++),n<64&&u[t+1]&&(i+=j[t+1],a++),r>0&&u[t-65]&&(i+=j[t-65],a++),r<64&&u[t+65]&&(i+=j[t+65],a++),a<3||(j[t]=Math.max((j[t]+i/a)/2,ne[t]))}wy(k,A,j,M,u,H,65,s,c,O,ne);let re=new Float32Array(o*2);for(let e=0;e<o;e++)g[e]!==C&&u[e]&&(re[e*2]=k[e]-w[e*2],re[e*2+1]=A[e]-w[e*2+1],t[e]=j[e],n[e]=j[e],r[e]=j[e]-a);return m(re)}liftsOff(e,t){let n=!1,r=0;for(let i=0;i<t.mask.length;i++)t.own[i]&&(t.mask[i]?e[i]>t.top+gy&&(n=!0):e[i]<=t.ground[i]+_y&&r++);return n&&r<vy*t.ownCount}hangsOff(e,t,n,r,i){let[a,o]=this.frameToWorld(e,e.comX,e.comY),s=[];for(let e=0;e<65;e++){let a=-1,o=-1;for(let r=0;r<65;r++){let i=e*65+r;n.own[i]&&(n.mask[i]||t[i]<=n.ground[i]+_y)&&(a<0&&(a=i),o=i)}a<0||(s.push([r[a],i[a]]),o!==a&&s.push([r[o],i[o]]))}return bm(ym(s),a,o)<this.edgeOf(e)}stickHeld(e,t,n,r,i){let a=4225,o=ub(e.asset,65),s=new Float32Array(a),c=-1/0,l=0;for(let e=0;e<a;e++)o[e]&&(l++,s[e]=r(t[e],n[e])+i,s[e]>c&&(c=s[e]));if(c===-1/0)return null;let u=new Uint8Array(a),d=0,f=0,p=0;for(let e=0;e<a;e++)!o[e]||s[e]<c-py||(u[e]=1,d++,f+=t[e],p+=n[e]);return d===0?null:{mask:u,top:c,cx:f/d,cy:p/d,ground:s,own:o,ownCount:l}}unstretch(e,t){let n=e.w/64,r=e.h/64;if(!yb(t,this.hangLive(e),65,n,r,pv))return null;let i=e.drawnIn;if(i&&Db(i.z,t,Zv))return i.shift;let{order:a,depth:o}=this.fromMiddle(e),s=Yb(e.rest,t,a,o,65,n,r);return e.drawnIn={z:Float32Array.from(t),shift:s},s}fromMiddle(e){if(e.middle)return e.middle;let t=Math.min(64,Math.max(0,Math.round(e.comX*64))),n=Math.min(64,Math.max(0,Math.round(e.comY*64))),{order:r,depth:i,tail:a}=bb(this.hangLive(e),65,[n*65+t]);return e.middle={order:r.subarray(0,a),depth:i}}hangLive(e){if(e.live)return e.live;let t=e.rest,n=new Uint8Array(4225);for(let r=0;r<n.length;r++)n[r]=+!!Sy(e.asset,t[r*2]/e.w+e.cx,e.cy-t[r*2+1]/e.h);let r=new Uint8Array(4225);for(let e=0;e<65;e++)for(let t=0;t<65;t++)if(n[e*65+t])for(let n=Math.max(0,e-2);n<=Math.min(64,e+2);n++)for(let e=Math.max(0,t-2);e<=Math.min(64,t+2);e++)r[n*65+e]=1;return e.live=r}flatten(e,t){if(e.flatAt===t)return;let n=$[e.type].thick/11,r=e.xyz,i=r.length/3,a=this.gridLayers(e),o=e.rest,s=a?e.fold?.length===r.length?e.fold:e.fold=new Float32Array(r.length):e.fold=null;for(let e=0;e<i;e++)r[e*3]=o[e*2],r[e*3+1]=o[e*2+1],r[e*3+2]=t+n*(a?a[e]:1),s&&(s[e*3]=0,s[e*3+1]=0,s[e*3+2]=Ey(a,e,n));e.shift=null,e.shiftMax=0,e.draped=void 0,e.ver++,(e.ground??=new Float32Array(i)).fill(t),e.flatAt=t}topOf(e){return $[e.type].drape?ib(e)(e.x,e.y)+e.lift:e.base+this.thickOf(e)+e.lift}thickOf(e){return wm($[e.type].thick/11,e.ax,e.ay)}yielded(e,t,n,r,i){let[a,o]=e.yield;if(a===0&&o===0)return;t.ax+=a,t.ay+=o;let s=N_(n.length,r,i,t.ax,t.ay);s>-1/0&&(t.h=s)}yields(e){let t=this.pieces[this.pieces.length-1];if(!t)return!1;let n=t===e?0:t.mass,r=this.loads(t,n),i=new Map;for(let t of this.pieces){if(t.lift>0||t===e)continue;let n=new Set,r=e=>{for(let{q:a}of e.on)n.has(a)||(n.add(a),i.set(a,(i.get(a)??0)+t.mass),r(a))};r(t)}let a=!1;for(let e of this.pieces){let o=0,s=0,c=r.get(e),l=i.get(e)??0;e.loaded=l>0;let u=e.bed,d=e.hull,f=l>0&&!!d&&!e.capped&&e.lift===0&&!e.on.some(e=>e.t);if(!(f&&u&&l<=u.mass*1.5&&u.x===e.x&&u.y===e.y&&u.rot===e.rot)){if(e.bed=void 0,c&&f){e.bed={mass:l,x:e.x,y:e.y,rot:e.rot};let r=c[1]/c[0],i=c[2]/c[0],[a,u]=Sm(d),f=Math.hypot(r-a,i-u),p=c[0]-(e===t?n:e.mass);if(f>1e-9&&p>0){let t=bm(d,r,i),n;if(t>=0)n=sy*(f/(f+t));else{let r=$[e.type].cm/11;n=sy+(cy-sy)*Math.min(1,-t/(oy*r))}n*=Math.min(1,p/ly),o=-(r-a)/f*n,s=-(i-u)/f*n}}(o!==e.yield[0]||s!==e.yield[1])&&(e.yield=[o,s],a=!0)}}return a}hold(e,t,n,r,i,a,o,s,c){E_.length<t.length&&(E_=new Int32Array(t.length*2));let l=Math.hypot(a.ax,a.ay)>=Uy;l&&D_.length<t.length&&(D_=new Int32Array(t.length*2));let u=0,d=[],f=new Map,p=0;for(let e=0;e<t.length;e++){let m=t[e];if(n[m]===-1/0)continue;let h=f_(m),g=p_(m),_=Cm(a,o,s,h,g)-(n[m]-i[e]),v=Math.hypot(h-o,g-s);if(_>Math.max(c,dy*v))continue;E_[p++]=m,d.push([h,g]),l&&_<=c&&(D_[u++]=m);let y=r[m];if(y<0||y>=this.pieces.length)continue;let b=this.pieces[y],x=f.get(b),S=_<=c;x?(x.x+=h,x.y+=g,x.n++,S&&(x.t=!0)):f.set(b,{q:b,x:h,y:g,r:0,n:1,...S?{t:S}:{}})}e.hull=d.length>=3?ym(d):null,e.upper=l?Hy(u,o,s,a.ax,a.ay):void 0;let m=!0,h=Math.hypot(a.ax,a.ay);if(p>0&&h>1e-9){let e=a.ax/h,t=a.ay/h,r=1/0;for(let n=0;n<p;n++)r=Math.min(r,e*f_(E_[n])+t*p_(E_[n]));let i=(e,t)=>{let r=n[e],i=n[e-t*Fv],a=n[e+t*Fv],o=i===void 0||i===-1/0?1/0:Math.abs(r-i),s=a===void 0||a===-1/0?1/0:Math.abs(a-r),c=Math.min(o,s);return c===1/0?0:c*128/Fv},o=[];for(let n=0;n<p;n++){let a=E_[n];e*f_(a)+t*p_(a)>r+Pv||o.push(Math.hypot(i(a,1),i(a,128)))}o.sort((e,t)=>e-t),m=o[Math.floor((o.length-1)/2)]<=Nv}e.grips=m;for(let e of f.values())e.x/=e.n,e.y/=e.n;for(let e=0;e<p;e++){let t=E_[e],n=r[t],i=n>=0&&n<this.pieces.length?f.get(this.pieces[n]):void 0;if(!i)continue;let a=Math.hypot(f_(t)-i.x,p_(t)-i.y);a>i.r&&(i.r=a)}e.on=[...f.values()]}restPiece(e,t,n,r,i,a,o,s=!1){let[c,l]=this.frameToWorld(e,e.comX,e.comY),u=this.pose,d=s&&!!e.freed&&e.freed.x===e.x&&e.freed.y===e.y&&e.freed.rot===e.rot;s&&(e.freed=void 0),this.slivers(t,n,i),j_(t,n,c,l,u,i);let f=u.capped&&o!==void 0,p=f?jy(t,o,i,a,c,l,u.h):null,m=e.tucked;if(e.tucked=void 0,p&&e===this.pieces[this.pieces.length-1]&&!(m&&m.x===e.x&&m.y===e.y)){j_(t,p.sup,c,l,u,i);let r=wm(a,u.ax,u.ay),s=0;for(let e of t)o.bottom[e]-o.beneath[e]>a&&Cm(u,c,l,f_(e),p_(e))+r<=o.bottom[e]&&s++;s>(this.sliding===e?Wv:Gv)*t.length&&(p=null),j_(t,n,c,l,u,i)}if(p&&(e.tucked={x:e.x,y:e.y}),p)n=p.sup,r=p.owner,j_(t,n,c,l,u,i);else if(u.capped||s&&this.onRimAlone(e,t.length,u,c,l,d?qy:Ky)){let o=d?7:u.capped?Fy:Iy;for(let e of t)Zy[e]=n[e],Qy[e]=r[e];Jy(t,Zy,Qy,i,a,c,l,u,o,d)&&(n=Zy,r=Qy,s&&(e.freed={x:e.x,y:e.y,rot:e.rot}))}return u.capped||L_(t,n,r,c,l,u),e.com=[c,l],this.hold(e,t,n,r,i,u,c,l,By(a)),this.yielded(e,u,t,c,l),e.ax=u.ax,e.ay=u.ay,e.capped=u.capped,e.base=Cm(u,c,l,e.x,e.y),f}onRimAlone(e,t,n,r,i,a=Ky){let o=!1;for(let s=0;s<t;s++){let t=A_[s];if(!(t>n.h))continue;let c=O_[s],l=k_[s];if(!(n.h+n.ax*(c-r)+n.ay*(l-i)-t>I_)){if(a.every(([t,n])=>this.covers(e,c+t,l+n)))return!1;o=!0}}return o}slabTips(e,t,n,r,i){let a=Math.hypot(e.ax,e.ay);if(!e.hull||a<Uy)return null;let o=e.ax/a,s=e.ay/a,[c,l]=e.com,u=e.upper;if(!u||u.length===0)return null;let d=1/0,f=-1/0,p=1/0,m=-1/0;for(let e=0;e<u.length;e+=2)d=Math.min(d,u[e]-Ly),f=Math.max(f,u[e]+Ly),p=Math.min(p,u[e+1]-Ly),m=Math.max(m,u[e+1]+Ly);let h=ub(e.asset,65),g=e.rest,_=Math.cos(e.rot),v=Math.sin(e.rot),y=By($[e.type].thick/11)+Ry;for(let a=0;a<h.length;a++){if(!h[a])continue;let b=g[a*2]+(n?n[a*2]:0),x=g[a*2+1]+(n?n[a*2+1]:0),S=e.x+b*_-x*v;if(S<d||S>f)continue;let C=e.y+b*v+x*_;if(C<p||C>m||(S-c)*o+(C-l)*s<=0)continue;let w=!1;for(let e=0;e<u.length&&!w;e+=2)w=(S-u[e])**2+(C-u[e+1])**2<=Ly*Ly;if(!w)continue;let T=t[a]-i-r(S,C);if(T>y||T<-zy)continue;let E=t[a]-i-this.undersideAt(e,S,C);if(!(E<-zy||E>Ry))return null}return this.onSheet(e,u)?null:[-o,-s]}onSheet(e,t){for(let n of this.pieces){if(n===e)break;if(!(n.lift>0||this.bendOf(n)===0))for(let r=0;r<t.length;r+=2){let i=t[r],a=t[r+1],o=Math.max($v,dy*Math.hypot(i-e.com[0],a-e.com[1]));if(this.covers(n,i,a)&&Math.abs(this.undersideAt(e,i,a)-ab(n,i,a))<=o)return!0}}return!1}tipping(e){return e.loaded&&this.bendOf(e)===0?null:e.tips}bodyTips(e,t){let n=Math.hypot(e.ax,e.ay),r=e.upper;if(!e.hull||n<Uy||!r||r.length===0)return null;let i=e.ax/n,a=e.ay/n,o=By($[e.type].thick/11),s=[];for(let n=0;n<r.length;n+=32){s.length=0;for(let e=n;e<Math.min(r.length,n+32);e+=2)s.push(m_(r[e],r[e+1]));let i=ev(e,s,`bot`,e.ax,e.ay);for(let n=0;n<s.length;n++){let r=s[n],a=f_(r),c=p_(r),l=dy*Math.hypot(a-e.com[0],c-e.com[1]);if(this.undersideAt(e,a,c)+i[n]-t[r]<=Math.max(o,l)+Ry)return null}}return this.onSheet(e,r)?null:[-i,-a]}unrest(e){e.ax=0,e.ay=0,e.capped=!1,e.grips=void 0,e.hull=null,e.stuck=!1,e.hold=null,e.tips=null,e.upper=void 0,e.on=[]}edgeOf(e){return fy*$[e.type].cm/11}balancedOnEdge(e){if(!e.hull||e.capped)return null;let[t,n]=e.com;if(bm(e.hull,t,n)>=this.edgeOf(e))return null;let[r,i]=Sm(e.hull),a=Math.hypot(t-r,n-i);return a<1e-9?null:[(t-r)/a,(n-i)/a]}loads(e,t){let n=new Map;for(let r of this.pieces){if(r.lift>0)continue;let i=r===e?t:r.mass;n.set(r,[i,i*r.com[0],i*r.com[1]])}for(let e=this.pieces.length-1;e>=0;e--){let t=this.pieces[e],r=n.get(t);r&&b_(t,r,n)}return n}press(e,t,n){if(e.lift>0||t.length===0)return;let r=$[e.type],i=r.thick/11,a=Hb(e),o=r.shape?e.asset.shape:null,s=Math.cos(e.rot),c=Math.sin(e.rot),l=e.asset;for(let t of this.pieces){if(t===e)break;let r=t.heldNext;if(!r||this.bendOf(t)>0||Math.hypot(t.x-e.x,t.y-e.y)>a+Hb(t))continue;let u=$[t.type],d=u.thick/11,f=(u.stiff??0)>=.5?null:this.gridLayers(t),p=(e,n,r)=>e+this.sunkAt(t,n,Dy(d,f?f[r]:1)),m=ub(t.asset,65),h=(e.pressed??=new WeakMap).get(t);if(h&&h.pv===e.ver&&h.qv===t.ver){let{idx:e,val:t,cell:n}=h;for(let i=0;i<e.length;i++){let a=p(t[i],n[i],e[i]);a<r[e[i]]&&(r[e[i]]=a)}continue}let g=[],_=[],v=[],y=t.xyz,b=Math.cos(t.rot),x=Math.sin(t.rot),S=(e.x-t.x)*b+(e.y-t.y)*x,C=-(e.x-t.x)*x+(e.y-t.y)*b,w=a+(t.shiftMax??0),T=Math.max(0,Math.floor(((S-w)/t.w+t.cx)*64)),E=Math.min(64,Math.ceil(((S+w)/t.w+t.cx)*64)),D=Math.max(0,Math.floor((t.cy-(C+w)/t.h)*64)),O=Math.min(64,Math.ceil((t.cy-(C-w)/t.h)*64));for(let u=D;u<=O;u++)for(let h=T;h<=E;h++){let w=u*65+h,T=y[w*3],E=y[w*3+1];if(Math.abs(T-S)>a||Math.abs(E-C)>a||!m[w])continue;let D=t.x+T*b-E*x,O=t.y+T*x+E*b,k=D-e.x,A=O-e.y,j=m_(D,O);if(n?n[j]===-1/0:!Sy(l,(k*s+A*c)/e.w+e.cx,e.cy-(-k*c+A*s)/e.h))continue;let M=n?n[j]-i:this.undersideAt(e,D,O)+(o?this.shapeAt(e,D,O,`bot`,o,s,c):0);if(y[w*3+2]-(f&&t.fold?t.fold[w*3+2]:Ey(f,w,d))-d>=M+i)continue;g.push(w),_.push(M),v.push(j);let N=p(M,j,w);N<r[w]&&(r[w]=N)}e.pressed.set(t,{pv:e.ver,qv:t.ver,idx:Int32Array.from(g),val:Float32Array.from(_),cell:Int32Array.from(v)})}}stateKey(){let e;for(let t of this.pieces){if(sb[0]=t.base,sb[1]=t.ax,sb[2]=t.ay,sb[3]=t.sink??0,e=$p(cb,e),!$[t.type].drape)continue;let n=t.xyz;e=$p(new Uint32Array(n.buffer,n.byteOffset,n.length),e)}return e??0}*layAll(e){let t=this.grids;h_(t,this.spread);let n=this.pieces[this.pieces.length-1]??null,r=!1;for(let i of this.pieces)i===n&&v_(this.gridsBelow,t),(yield*this.layOn(i,t,i!==e))&&(r=!0),yield;return this.gridsBelowOf=n,r}weighKey(e=null){let t=``;for(let n of this.pieces)n.lift===0&&n!==e&&(t+=`${n.id} ${n.x} ${n.y} ${n.rot}|`);return t}get settled(){return this.weighKey()===this.lastStack}laidTop(e){return e===this.pieces[this.pieces.length-1]&&e===this.gridsBelowOf}lay(e,t,n){return Wb(this.layOn(e,t,n))}*layOn(e,t,n){let r=$[e.type];e.stackLaid=!0;let i=this.cellsUnder(e),a=(r.stiff??0)>=Rv,o=this.bendOf(e)>0,s=t.sup,c=t.flat,l=n?this.pieces.indexOf(e):-1,u=n&&e.lift===0?this.bearsOf(e,i):null,d=!1,f=(e,t)=>{u&&u[e]!==+t&&(u[e]=+t,d=!0)};if(r.drape&&e.lift>0){let t=zf;for(let e of i)t=Math.max(t,s[e]);t=this.topAhead(i,s,t),this.flatten(e,t+.004),this.unrest(e)}else if(r.drape){if(yield*this.drape(e,t,i),n){let n=vb(e);a&&this.press(e,i,n);let u=!a&&e.steep?this.steepCells(e):null,d=r.thick/11,p=Math.cos(-e.rot),m=Math.sin(-e.rot);for(let r=0;r<i.length;r++){let h=i[r];if(n[h]===-1/0){f(r,!a);continue}let g=this.sunkAt(e,h,d),_=n[h]+e.lift-g;if(s[h]=Math.max(s[h],_),a)f(r,_+g>=c[h]),y_(t,h,_,n[h]+e.lift-d,l);else if(o)f(r,!0),c[h]=_;else{f(r,!0);let t=Dy(d,this.layersAtWorld(e,f_(h),p_(h),p,m)),n=c[h]+t-this.sunkAt(e,h,t);c[h]=u?.has(h)&&_>n?_:n}}}}else{let a=this.pose,o=!0;if(e.lift>0){e.restFor=null,this.unrest(e),e.base=zf;for(let t of i)e.base=Math.max(e.base,c[t]);e.base=this.topAhead(i,c,e.base)}else if(this.restsAsBefore(e,i,t))o=!1;else if(i.length>0){let n=r.thick/11,a=!1,o=0,s=0;for(let r=0;r<Q_;r++){let r=ev(e,i,`bot`,o,s);for(let e=0;e<i.length;e++)r[e]+=this.sinkAt(i[e],c,n,tv);if(a=this.restPiece(e,i,c,t.owner,r,n,t),Math.abs(e.ax-o)+Math.abs(e.ay-s)<$_)break;o=e.ax,s=e.ay}let l;a&&(l=new Float32Array(i.length*2),i.forEach((e,n)=>{l[n*2]=t.bottom[e],l[n*2+1]=t.beneath[e]})),e.restFor={x:e.x,y:e.y,rot:e.rot,yield:e.yield,under:Float32Array.from(i,e=>c[e]),rim:l},e.tips=this.bodyTips(e,c)}else e.restFor=null,this.unrest(e),e.base=zf;if(o&&e.ver++,n&&e.lift===0){this.press(e,i),a.h=e.base,a.ax=e.ax,a.ay=e.ay;let n=this.bodyOf(e,i,`top`),r=e.sink?this.bodyOf(e,i,`bot`):null;for(let o=0;o<i.length;o++){let u=i[o],d=n[o];if(s[u]===-1/0||Number.isNaN(d)){f(o,!1);continue}let p=Cm(a,e.x,e.y,f_(u),p_(u))+e.lift,m=this.sunkAt(e,u,d-(r&&Number.isFinite(r[o])?r[o]:0)),h=p+d-m;h>s[u]&&(s[u]=h),f(o,h+m>=c[u]),y_(t,u,h,p,l)}}}return d}bearsOf(e,t){return e.bears?.cells!==t&&(e.bears={cells:t,on:new Uint8Array(t.length).fill(1)}),e.bears.on}bodyOf(e,t,n){let r=e.restFor;return r?(r.body&&r.body.ax===e.ax&&r.body.ay===e.ay||(r.body={ax:e.ax,ay:e.ay,top:null,bot:null}),r.body[n]??=ev(e,t,n,e.ax,e.ay)):ev(e,t,n,e.ax,e.ay)}steepCells(e){let t=this.steepMemo.get(e);if(t&&t.ver===e.ver&&t.steep===e.steep&&t.x===e.x&&t.y===e.y&&t.rot===e.rot)return t.cells;let n=new Set,r=e.xyz,i=Math.cos(e.rot),a=Math.sin(e.rot),o=Math.ceil(Math.max(e.w,e.h)/64*128);return e.steep.forEach((t,s)=>{if(!t)return;let c=r[s*3],l=r[s*3+1],u=m_(e.x+c*i-l*a,e.y+c*a+l*i),d=u%128,f=(u-d)/128;for(let e=Math.max(0,f-o);e<=Math.min(127,f+o);e++)for(let t=Math.max(0,d-o);t<=Math.min(127,d+o);t++)n.add(e*128+t)}),this.steepMemo.set(e,{ver:e.ver,steep:e.steep,x:e.x,y:e.y,rot:e.rot,cells:n}),n}restsAsBefore(e,t,n){let r=e.restFor;if(!r||r.x!==e.x||r.y!==e.y||r.rot!==e.rot||r.yield!==e.yield||r.under.length!==t.length)return!1;let i=r.rim;for(let e=0;e<t.length;e++){let a=t[e];if(!Eb(r.under[e],n.flat[a],Xv)||i&&(!Eb(i[e*2],n.bottom[a],Xv)||!Eb(i[e*2+1],n.beneath[a],Xv)))return!1}return!0}slideDir(e){return this.tipping(e)??this.downhill(e)??this.balancedOnEdge(e)??this.overTop(e)}overTop(e){if(e!==this.put||this.topOf(e)-e.lift-$[e.type].thick/11-zf<25/11)return null;let t=Math.hypot(e.x,e.y);return t>1e-6?[e.x/t,e.y/t]:[Math.cos(e.rot),Math.sin(e.rot)]}downhill(e){let t=Math.hypot(e.ax,e.ay);return(e.capped||t>Mv||this.pastBend(e)||t>Nv&&e.grips===!1)&&t>1e-9?[-e.ax/t,-e.ay/t]:null}pastBend(e){let t=$[e.type];return t.drape&&(t.stiff??0)>=.5&&Math.hypot(e.ax,e.ay)>Math.tan(Hv(t.stiff))}frameOf(e,t){let n=$[e],r=t.frame,i=n.cm/11/r.objectW,a=this.centroids.get(t);a||(a={com:Tm(t.alpha,t.aw,t.ah),share:Em(t.alpha)},this.centroids.set(t,a));let o=a.com;return{w:r.frameW*i,h:r.frameH*i,cx:(r.objectX-r.frameX+r.objectW/2)/r.frameW,cy:(r.objectY-r.frameY+r.objectH/2)/r.frameH,comX:o[0],comY:o[1],share:a.share,k:i,asset:t}}piece(e,t,n,r,i,a){let o=$[e],{w:s,h:c,cx:l,cy:u,comX:d,comY:f,share:p}=this.frameOf(e,n),m,h=new Float32Array;if(o.drape){m=Kb(s,c,l,u),h=new Float32Array(m.length*1.5);for(let e=0;e<m.length/2;e++)h[e*3]=m[e*2],h[e*3+1]=m[e*2+1]}let g=p*s*c*o.thick/11;return{type:e,v:t,x:r,y:i,rot:a,base:zf,ax:0,ay:0,capped:!1,hull:null,stuck:!1,hold:null,tips:null,on:[],mass:g,com:[r,i],yield:[0,0],lift:0,w:s,h:c,cx:l,cy:u,comX:d,comY:f,asset:n,flatAt:null,restFor:null,rest:m,xyz:h,shift:null,ver:0,id:++S_}}push(e){this.pieces.push(e)}carryOn(e){let t=this.laidAlone;t&&t!==e&&t.lift===0&&this.pieces.includes(t)&&this.addLevel(t,this.grids,!1),this.laidAlone=null,v_(this.gridsBelow,this.grids),this.gridsBelowOf=e}gridsFromBelow(){v_(this.grids,this.gridsBelow)}foldAlone(){let e=this.laidAlone;this.laidAlone=null,e&&e.lift===0&&this.pieces.includes(e)&&this.addAsLies(e,this.grids)}addAsLies(e,t){let n=$[e.type],r=this.cellsUnder(e),i=this.pieces.indexOf(e);if(n.drape){let a=vb(e),o=(n.stiff??0)>=Rv,s=n.thick/11;for(let e of r){let n=a[e];n!==-1/0&&(t.sup[e]=Math.max(t.sup[e],n),o?y_(t,e,n,n-s,i):t.flat[e]=Math.max(t.flat[e],n))}return}let a=this.pose;a.h=e.base,a.ax=e.ax,a.ay=e.ay;let o=this.bodyOf(e,r,`top`);for(let n=0;n<r.length;n++){let s=r[n],c=o[n];if(t.sup[s]===-1/0||Number.isNaN(c))continue;let l=Cm(a,e.x,e.y,f_(s),p_(s)),u=l+c;u>t.sup[s]&&(t.sup[s]=u),y_(t,s,u,l,i)}}takeOff(e){let t=this.pieces.indexOf(e);t>=0&&this.pieces.splice(t,1),this.gridsBelowOf===e&&(this.gridsBelowOf=null),this.laidAlone===e&&(this.laidAlone=null)}toTop(e){let t=this.pieces.indexOf(e);t>=0&&this.pieces.splice(t,1),this.pieces.push(e)}settle(e){return Wb(this.settlePasses(e))}*settlePasses(e){let t=0;this.settles=++Ob,this.laying=e,this.laidAlone=null,this.plateLog.length=0;let n=this.weighKey(e),r=n!==this.lastStack&&!this.probe,i=r?ny:0,a=r&&!!this.lastStack&&n.startsWith(this.lastStack);r&&this.squashStack(e);let o=NaN,s=NaN;for(let n=0;n<ty;n++){t++,this.firm=n>=i;for(let t of this.pieces){if(!$[t.type].drape||t===e)continue;let r=t.heldNext??=new Float32Array(t.xyz.length/3);(n>=i||a)&&t.held?r.set(t.held):r.fill(1/0)}let r=yield*this.layAll(e),c=!1;for(let t of this.pieces){let n=t.heldNext;if(!n||t===e)continue;let r=t.held;r&&Db(n,r,Yv)||(c=!0),t.heldNext=r,t.held=n}if(!this.probe&&!this.pieces.some(e=>e.lift>0)&&this.yields(e)&&(c=!0),n<i&&r&&this.squashStack(e)&&(c=!0),!c){for(let t of this.pieces){if(!t.heldNext||t===e||!t.held)continue;let n=t.held;t.held=t.heldNext,t.heldNext=n}break}let l=this.stateKey();if(l===o)break;[o,s]=[s,l]}return this.laying=null,this.laidAlone=null,this.probe||(this.lastStack=n),t}settleTop(){let e=this.pieces[this.pieces.length-1];return!e||e!==this.gridsBelowOf?!1:(this.lay(e,this.gridsBelow,!1),this.laidAlone=e,!0)}slidLand=null;slidSteps=null;slide(e,t,n,r,i=this.gridsBelow,a=e=>this.slideDir(e)){let o=this.slideSteps(e,t,n,r,i,a);for(;;){let e=o.next();if(e.done)return e.value}}*slideSteps(e,t,n,r,i=this.gridsBelow,a=e=>this.slideDir(e),o={}){let s=e.x,c=e.y;this.slidLand=null,this.slidSteps=null;let l=!$[e.type].drape;r&&(r.length=0);let u=()=>{r&&l&&r.push({x:e.x,y:e.y,base:e.base,ax:e.ax,ay:e.ay})};u();let d=0,f=0,p=this.bendOf(e)>0,m=p?hy:kv,h=!l&&!p,g=[],_=[],v=t=>{let n=yy(e);return g.push(n),_.push(t),n};l||v(0);let y=0,b=0,x=p?null:this.tipping(e),S=!!x&&x[0]*t[0]+x[1]*t[1]>=jv;for(let r=0;r<Av;r++){let s;if(r===0?s=t:p?s=this.tipping(e)?t:a(e):(s=a(e),S&&s&&(s=s[0]*t[0]+s[1]*t[1]<jv?null:this.tipping(e)?t:s)),!s)break;let[c,l]=s;if(r>0&&c*d+l*f<0)break;d=c,f=l,e.x+=c*m,e.y+=l*m,y++;let g=!n(e.x,e.y);if(g&&(!p||this.cellsUnder(e).length===0))break;this.sliding=e;let _=this.shell;o.plate&&(this.shell=!1);try{this.lay(e,i,!1)}finally{this.sliding=null,this.shell=_}if(g&&!this.tipping(e)||g&&p&&this.torn(e))break;b=y,u(),yield p||h&&y%5==0?v(y):null}let C=e.x,w=e.y;if(C===s&&w===c)return null;h&&b>_[_.length-1]&&v(b);let T=$[e.type];return T.drape&&(T.stiff??0)>=.5&&n(C,w)&&(this.slidLand=e.xyz.slice()),p?this.slidSteps={shapes:g,count:y}:h&&(this.slidSteps={shapes:g,count:y,at:_}),e.x=s,e.y=c,o.back!==!1&&this.lay(e,i,!1),[C,w]}torn(e){let t=new Float32Array(4225);for(let n=0;n<t.length;n++)t[n]=e.xyz[n*3+2];return yb(t,this.hangLive(e),65,e.w/64,e.h/64,36)}slipUnder(e,t){let n=this.breadTest();if(!n)return null;let r=this.pieces.length-1;for(let i=0;i<=r;i++){let a=this.pieces[i];if(a===e||a.lift>0)continue;let o=$[a.type];if(o.drape&&(o.stiff??0)<.5)continue;let s=this.tipping(a),c=s??this.downhill(a);if(!c){a.heldAt={x:a.x,y:a.y,rot:a.rot,base:a.base,ax:a.ax,ay:a.ay};continue}if(i===r||this.carries(i)||!s&&!a.capped&&!this.pastBend(a)&&Yy(a))continue;let l=this.gridsUnder;h_(l,this.spread);for(let t=0;t<i;t++)this.lay(this.pieces[t],l,this.pieces[t]!==e);let u=this.slide(a,c,n,t,l,e=>this.tipping(e)??this.downhill(e));if(u)return{p:a,to:u}}return null}slipTop(e,t,n){let r=this.breadTest();if(!r)return null;let i=this.shell;this.shell=!1;try{return this.slide(e,t,r,n)}finally{this.shell=i}}*slipTopSteps(e,t,n){let r=this.breadTest();return r?yield*this.slideSteps(e,t,r,n,this.gridsBelow,e=>this.slideDir(e),{plate:!0,back:!1}):null}breadTest(){let e=this.bread;return e?(t,n)=>e[m_(t,n)]===1:null}carries(e){let t=this.pieces[e];for(let n=e+1;n<this.pieces.length;n++){let r=this.pieces[n];if(!(r.lift>0)&&(r.on.some(e=>e.q===t)||r.draped?.owners.includes(e)))return!0}return!1}layLevel(){let e=this.grids;h_(e,this.spread);for(let t of this.pieces)this.addLevel(t,e,!0);this.lastStack=null}addLevel(e,t,n){let r=$[e.type],i=this.cellsUnder(e),a=zf;for(let e of i)a=Math.max(a,t.sup[e]);let o=r.thick/11;if(n&&(r.drape?this.flatten(e,a):(this.unrest(e),e.base=a,e.ver++)),!(e.lift>0))for(let e of i)t.sup[e]=a+o,t.flat[e]=a+o}};function Zb(e,t,n){let r=new Float32Array(t*n);for(let t=0;t<r.length;t++)r[t]=e[t]?1e9:0;let i=Math.SQRT2,a=(e,i)=>e<0||i<0||e>=t||i>=n?0:r[i*t+e];for(let e=0;e<n;e++)for(let n=0;n<t;n++){let o=e*t+n;r[o]&&(r[o]=Math.min(r[o],a(n-1,e)+1,a(n,e-1)+1,a(n-1,e-1)+i,a(n+1,e-1)+i))}for(let e=n-1;e>=0;e--)for(let n=t-1;n>=0;n--){let o=e*t+n;r[o]&&(r[o]=Math.min(r[o],a(n+1,e)+1,a(n,e+1)+1,a(n+1,e+1)+i,a(n-1,e+1)+i))}for(let e=0;e<r.length;e++)r[e]&&(r[e]=r[e]-.5);return r}var Qb=8;function $b(e,t,n){let r=new Float32Array(t*n),i=e.length;if(i===0)return r;let a=new Float64Array(i),o=new Float64Array(i),s=new Float64Array(i),c=new Float64Array(i);for(let t=0;t<i;t++){let n=e[t],r=e[(t+1)%i];a[t]=n[0],o[t]=n[1],s[t]=r[0],c[t]=r[1]}let l=Math.ceil(t/Qb),u=Math.ceil(n/Qb),d=(e,t)=>Math.max(0,Math.min(t-1,Math.floor(e/Qb))),{count:f,items:p}=If(i,l,u,e=>[d(Math.min(a[e],s[e]),l),d(Math.max(a[e],s[e]),l),d(Math.min(o[e],c[e]),u),d(Math.max(o[e],c[e]),u)]),m=new Float64Array(i),h=0,g=0,_=(e,t)=>{for(let n=f[e];n<f[e+1];n++){let e=p[n],r=jf(h,g,a[e],o[e],s[e],c[e]);r<t&&(t=r)}return t};for(g=0;g<n;g++){let e=0;for(let t=0;t<i;t++)o[t]>g!=c[t]>g&&(m[e++]=(s[t]-a[t])*(g-o[t])/(c[t]-o[t])+a[t]);let n=d(g,u);for(h=0;h<t;h++){let i=!1;for(let t=0;t<e;t++)h<m[t]&&(i=!i);let a=Lf(d(h,l),n,l,u,Qb,_);r[g*t+h]=i?Math.sqrt(a):-Math.sqrt(a)}}return r}var ex=.05;function tx(e,t,n,r){let i=e;for(let e=0;e<3;e++){let e=new Float32Array(i.length);for(let a=0;a<n;a++)for(let n=0;n<t;n++){let o=0,s=0;for(let e=-r;e<=r;e++){let r=n+e;r<0||r>=t||(o+=i[a*t+r],s++)}e[a*t+n]=o/s}let a=new Float32Array(i.length);for(let i=0;i<n;i++)for(let o=0;o<t;o++){let s=0,c=0;for(let a=-r;a<=r;a++){let r=i+a;r<0||r>=n||(s+=e[r*t+o],c++)}a[i*t+o]=s/c}i=a}return i}function nx(e,t,n,r,i){let a=n*r,o=new Float32Array(a),s=new Float32Array(a);for(let n=0;n<a;n++){let r=e[n*3],i=e[n*3+1],a=e[n*3+2];o[n]=Math.max(4,.299*r+.587*i+.114*a);let c=Math.max(r,i,a);s[n]=t[n]&&c>0?sx(.45,.75,(c-Math.min(r,i,a))/c):0}let c=[...o.filter((e,t)=>s[t]>.5)].sort((e,t)=>e-t),l=c[Math.floor(c.length*.95)]??255,u=new Float32Array(a);for(let e=0;e<a;e++)u[e]=s[e]*Math.max(0,-Math.log(o[e]/l));let d=tx(u,n,r,i),f=tx(s,n,r,i),p=0,m=0;for(let e=0;e<a;e++)f[e]>.001&&(p+=d[e]/f[e],m++);p/=Math.max(1,m);let h=Float32Array.from(d,(e,t)=>f[t]>.001?e/f[t]:p),g=[...h.filter((e,n)=>t[n])].sort((e,t)=>e-t),_=g[Math.floor(g.length*.05)]??0,v=g[Math.floor(g.length*.95)]??1;return Float32Array.from(h,e=>Math.min(1,Math.max(0,(e-_)/Math.max(1e-6,v-_))))}function rx(e,t,n,r){if(r<1)return;let i=Zb(Uint8Array.from(e,e=>+!e),t,n),a=Uint8Array.from(i,(t,n)=>e[n]||t+.5<=r?1:0),o=Zb(a,t,n);for(let t=0;t<e.length;t++)e[t]=a[t]&&o[t]+.5>r?1:0}function ix(e,t,n){let r=new Uint8Array(e.length),i=[];for(let e=0;e<t;e++)i.push(e,(n-1)*t+e);for(let e=0;e<n;e++)i.push(e*t,e*t+t-1);for(;i.length;){let a=i.pop();if(r[a]||e[a])continue;r[a]=1;let o=a%t,s=(a-o)/t;o>0&&i.push(a-1),o<t-1&&i.push(a+1),s>0&&i.push(a-t),s<n-1&&i.push(a+t)}for(let t=0;t<e.length;t++)r[t]||(e[t]=1)}function ax(e,t,n,r){let i=0,a=0;for(let e=0;e<n*r;e++)t[e]&&(i+=e%n,a++);let o=a?i/a:(n-1)/2,s=new Float32Array(e.length);for(let t=0;t<r;t++)for(let r=0;r<n;r++){let i=Math.min(n-1,Math.max(0,2*o-r)),a=Math.floor(i),c=Math.min(n-1,a+1),l=i-a,u=e[t*n+a]*(1-l)+e[t*n+c]*l;s[t*n+r]=(e[t*n+r]+u)/2}return s}function ox(e,t){let n=Math.min(1,Math.max(0,e)/t);return Math.sqrt(1-(1-n)*(1-n))}var sx=(e,t,n)=>{let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)};function cx(e,t,n,r,i,a,o,s,c){let l=n*r,u=new Uint8Array(l);for(let e=0;e<l;e++)u[e]=+(t[e]>.5);let d=s?$b(s,n,r).map(e=>e-1):Zb(u,n,r),f=new Float32Array(l),p=new Float32Array(l);if(e.kind===`round`){let t=a*(1-e.up),m=e.relief??0,h=null;if(m>0){if(!o)throw Error(`a relief needs the photo`);h=nx(o,u,n,r,Math.max(1,Math.round(ex/i))),e.mirror&&(h=ax(h,u,n,r))}let g=Math.min(e.round,a/2);for(let n=0;n<l;n++){if(e.wall){let e=ox(d[n]*i+(s?i:0),g);f[n]=a-g+g*e,p[n]=g-g*e;continue}let r=ox(d[n]*i,e.round)*(h?1-m+m*h[n]:1);f[n]=t+e.up*a*r+(c&&u[n]?c[n]:0),p[n]=t-(1-e.up)*a*r}}else if(e.kind===`hill`){if(!o)throw Error(`a hill needs the photo`);let t=new Uint8Array(l);for(let n=0;n<l;n++){let r=o[n*3],i=o[n*3+1],a=o[n*3+2],s=Math.max(r,i,a),c=s>0?(s-Math.min(r,i,a))/s:0;t[n]=u[n]&&sx(e.sat[0],e.sat[1],c)>.5?1:0}rx(t,n,r,.25/i),ix(t,n,r);let s=Zb(t,n,r),c=tx(Float32Array.from(s,t=>ox(t*i,e.hillRound)),n,r,1),m=0;for(let e=0;e<l;e++)m=Math.max(m,c[e]);if(m>0)for(let e=0;e<l;e++)c[e]=c[e]/m;for(let t=0;t<l;t++)f[t]=e.base*ox(d[t]*i,e.round)+(a-e.base)*c[t],p[t]=0}else{let t=n,i=0,o=r,s=0;for(let e=0;e<r;e++)for(let r=0;r<n;r++)u[e*n+r]&&(t=Math.min(t,r),i=Math.max(i,r),o=Math.min(o,e),s=Math.max(s,e));let c=e.seed>>>0||1,d=()=>(c^=c<<13,c^=c>>>17,c^=c<<5,(c>>>0)/4294967296),m=.6+d()*.6,h=(d()-.5)*1.6,g=(d()-.5)*.6,_=Array.from({length:3},()=>({fx:1+d()*2,fy:1+d()*2,ph:d()*Math.PI*2,a:.15+d()*.2})),v=(t+i)/2,y=(o+s)/2,b=Math.max(1,(i-t)/2),x=Math.max(1,(s-o)/2),S=new Float32Array(l),C=1/0,w=-1/0;for(let e=0;e<r;e++)for(let t=0;t<n;t++){let r=(t-v)/b,i=(e-y)/x,a=m*(r*r+i*i)+h*(r*r-i*i)+g*r;for(let e of _)a+=e.a*Math.sin(e.fx*r*Math.PI+e.ph)*Math.cos(e.fy*i*Math.PI+e.ph*.7);let o=e*n+t;S[o]=a,u[o]&&(C=Math.min(C,a),w=Math.max(w,a))}let T=a-e.skin,E=w>C?w-C:1;for(let t=0;t<l;t++)p[t]=(S[t]-C)/E*T,f[t]=p[t]+e.skin}let m=1/0;for(let e=0;e<l;e++)u[e]&&(m=Math.min(m,p[e]));if(Number.isFinite(m)&&m!==0)for(let e=0;e<l;e++)f[e]=f[e]-m,p[e]=p[e]-m;return{top:f,bot:p,dist:d}}var lx=60,ux=[];function dx(e){ux.length<lx&&ux.push({name:e,at:performance.now(),ms:0,moment:!0})}function fx(e,t){ux.length<lx&&ux.push({name:e,at:t,ms:performance.now()-t})}function px(e,t){let n=performance.now();try{return t()}finally{fx(e,n)}}function mx(e){window.requestIdleCallback?window.requestIdleCallback(t=>e(t)):window.setTimeout(()=>e(),200)}function hx(e,t){let n=hd(2654435769^Math.imul(t+1,2654435761)),[r,i]=e.length;return{length:r+(i-r)*n()**.6,width:1+(n()*2-1)*e.width,bow:(n()*2-1)*e.bow,kink:n()<.5?(n()<.5?-1:1)*(.35+.65*n())*e.kink:0,kinkAt:(n()<.5?-1:1)*(.1+.28*n())}}function gx(e,t,n,r,i,a,o){let s=a*e.length/2,c=Math.min(.12*a,s*.45),l=a/2,u=e=>{let t=Math.abs(e),n=t>s-c?l-(s-t):t*(l-c)/(s-c);return Math.sign(e)*n},d=s+Math.max(t,n),f=Math.ceil(d)*2+1,p=new Float64Array(f),m=new Float64Array(f),h=new Float64Array(f),g=new Float64Array(f),_=(f-1)/2,v=1;for(let a=0;a<12;a++){let a=.26*s,c=t=>{if(Math.abs(t)>s)return 0;let n=(t-e.kinkAt*2*s)/a;return v*(e.bow/(2*s)+e.kink*Math.exp(-.5*n*n)/(a*Math.sqrt(2*Math.PI)))};p[_]=0,m[_]=0;let l=0;for(let e=_+1;e<f;e++){let t=e-_;l+=c(t-.5),p[e]=p[e-1]+Math.cos(l),m[e]=m[e-1]+Math.sin(l)}l=0;for(let e=_-1;e>=0;e--){let t=e-_;l-=c(t+.5),p[e]=p[e+1]-Math.cos(l),m[e]=m[e+1]-Math.sin(l)}let u=Math.round(_-s),d=Math.round(_+s),h=Math.atan2(m[d]-m[u],p[d]-p[u]),g=Math.cos(-h),y=Math.sin(-h);for(let e=0;e<f;e++){let t=p[e],n=m[e];p[e]=t*g-n*y,m[e]=t*y+n*g}let b=1/0,x=-1/0,S=1/0,C=-1/0;for(let e=u;e<=d;e++)b=Math.min(b,p[e]),x=Math.max(x,p[e]),S=Math.min(S,m[e]),C=Math.max(C,m[e]);let w=r-(b+x)/2,T=i-(S+C)/2;for(let e=0;e<f;e++)p[e]+=w,m[e]+=T;let E=o*e.width/2+2;if(C-S+2*E<=n-4&&x-b+2*E<=t-4)break;v*=.8}for(let e=0;e<f;e++){let t=Math.max(0,e-1),n=Math.min(f-1,e+1),r=Math.hypot(p[n]-p[t],m[n]-m[t])||1;h[e]=(p[n]-p[t])/r,g[e]=(m[n]-m[t])/r}let y=new Int32Array(Math.ceil(t)+1);for(let e=0,t=0;e<y.length;e++){for(;t<f-1&&p[t+1]<=e;)t++;y[e]=t}let b=o*e.width,x=(t,n,a)=>{let o=y[Math.min(y.length-1,Math.max(0,Math.round(t)))],s=0,c=0,l=1,d=0;for(let e=0;e<4;e++){let r=Math.min(f-1.0001,Math.max(0,o)),i=Math.floor(r),a=r-i;s=p[i]+(p[i+1]-p[i])*a,c=m[i]+(m[i+1]-m[i])*a,l=h[i]+(h[i+1]-h[i])*a,d=g[i]+(g[i+1]-g[i])*a,o=e<3?r+(t-s)*l+(n-c)*d:r}let v=-(t-s)*d+(n-c)*l;return Math.abs(v)>b?!1:(a[0]=r+u(o-_),a[1]=i+v/e.width,!0)},S=new Float64Array(2),C=((e,t)=>x(e,t,S)?[S[0],S[1]]:null);C.into=x;let w=1/0,T=-1/0,E=1/0,D=-1/0;for(let e=Math.max(0,Math.floor(_-s));e<=Math.min(f-1,Math.ceil(_+s));e++)w=Math.min(w,p[e]),T=Math.max(T,p[e]),E=Math.min(E,m[e]),D=Math.max(D,m[e]);return C.x0=Math.max(0,Math.floor(w-b)),C.x1=Math.min(t,Math.ceil(T+b)),C.y0=Math.max(0,Math.floor(E-b)),C.y1=Math.min(n,Math.ceil(D+b)),C}function _x(e,t,n,r,i){let a=r-.5,o=i-.5,s=Math.floor(a),c=Math.floor(o),l=a-s,u=o-c,d=(r,i)=>r<0||i<0||r>=t||i>=n?0:e[i*t+r];return(d(s,c)*(1-l)+d(s+1,c)*l)*(1-u)+(d(s,c+1)*(1-l)+d(s+1,c+1)*l)*u}function vx(e,t,n,r,i,a,o){let s=e.naturalWidth,c=e.naturalHeight,l=bx(rf(e,s,c),s,c,t,n,r,i,a,o);return{img:yx(l.pixels,s,c),alpha:l.alpha}}function yx(e,t,n){let r=document.createElement(`canvas`);r.width=t,r.height=n;let i=r.getContext(`2d`,{willReadFrequently:!0});if(!i)throw Error(`2d context unavailable`);let a=i.createImageData(t,n);return a.data.set(e),i.putImageData(a,0,0),r}function bx(e,t,n,r,i,a,o,s,c){let l=t/o.frameW,u=gx(hx(s,c),t,n,(o.objectX-o.frameX+o.objectW/2)*l,(o.objectY-o.frameY+o.objectH/2)*l,o.objectW*l,o.objectH*l),d=new Uint8ClampedArray(t*n*4),f=new Float64Array(2);for(let r=u.y0;r<u.y1;r++)for(let i=u.x0;i<u.x1;i++){if(!u.into(i+.5,r+.5,f))continue;let a=f[0]-.5,o=f[1]-.5,s=Math.floor(a),c=Math.floor(o);if(s<0||c<0||s>=t-1||c>=n-1)continue;let l=a-s,p=o-c,m=(c*t+s)*4,h=m+t*4,g=(r*t+i)*4;for(let t=0;t<4;t++){let n=e[m+t]+(e[m+4+t]-e[m+t])*l,r=e[h+t]+(e[h+4+t]-e[h+t])*l;d[g+t]=n+(r-n)*p}}let p=new Uint8Array(i*a);for(let e=0;e<a;e++)for(let o=0;o<i;o++)u.into((o+.5)/i*t,(e+.5)/a*n,f)&&(p[e*i+o]=Math.round(_x(r,i,a,f[0]/t*i,f[1]/n*a)));return{pixels:d,alpha:p}}function xx(e,t){e.classList.remove(t),e.offsetWidth,e.classList.add(t)}function Sx(e,t,n,r,i){e[n]=0;for(let a=n+1;a<t;a++)e[a]=e[a-1]+Math.max(r,i(a-1));for(let t=n-1;t>=0;t--)e[t]=e[t+1]-Math.max(r,i(t))}function Cx(e,t,n,r,i){let a=n;for(let o=n;o<t;o++){let s=(o-n)*r;for(;a<t-1&&e[a+1]<s;)a++;let c=a<t-1?e[a+1]-e[a]:0;i[o]=a+(c>0?Math.min(1,(s-e[a])/c):0)}a=n;for(let t=n-1;t>=0;t--){let o=(t-n)*r;for(;a>0&&e[a-1]>o;)a--;let s=a>0?e[a]-e[a-1]:0;i[t]=a-(s>0?Math.min(1,(e[a]-o)/s):0)}}var wx=e=>Math.min(1,Math.max(0,e)),Tx=.03/11;function Ex(e,t,n,r){if(t.probe||t.free!==null||t.sliceTop!==e.sliceTop||t.pieces.length!==e.asked.length||t.pieces.length!==e.pieces.length)return!1;for(let n=0;n<t.pieces.length;n++){let r=t.pieces[n],i=e.asked[n];if(r.id!==i.id||r.type!==i.type||r.v!==i.v||r.x!==i.x||r.y!==i.y||r.rot!==i.rot||r.lift!==0||i.lift!==0)return!1}let i=Object.keys(r);if(i.length!==Object.keys(e.bends).length||i.some(t=>r[t]!==e.bends[t])||!n||!e.bread||n.length!==e.bread.length||n.some((t,n)=>t!==e.bread[n])||t.spread.length!==e.spread.length)return!1;for(let n=0;n<t.spread.length;n++)if(!(Math.abs(t.spread[n]-e.spread[n])<=Tx))return!1;return!0}function Dx(e,t,n){for(;e.slid.length<t;){let t=e.spots[e.next++];if(!t)return null;if(!e.slid.some(([e,r])=>Math.hypot(e-t[0],r-t[1])<n))return t}return null}function Ox(e,t){let n=[];for(let r of e)n.some(([e,n])=>Math.hypot(e-r[0],n-r[1])<t)||n.push(r);return n}function kx(e,t,n,r,i,a){for(;;){let o=Dx(n,r,i);if(!o)return!0;let s=n.lead!==void 0&&n.next>n.lead;if(s&&n.best!==void 0)return!0;t.x=o[0],t.y=o[1];let c=e.settleTop()&&!e.slideDir(t),l=Math.hypot(t.ax,t.ay);if(c&&n.want&&!s){if((n.best===void 0||t.base<n.best)&&(n.best=t.base,n.least=l,n.at=o),(n.held=(n.held??0)+1)>=n.want)return!0;if(performance.now()>a)return!1}else{if(n.best===void 0&&(c||l<n.least)&&(n.least=l,n.at=o),c)return!0;if(n.slid.push(o),performance.now()>a)return!1}}}var Ax=(e,t)=>t===void 0?e:`${e}#${t}`,jx=6,Mx=class{assets;stack=new Xb;byId=new Map;asked=[];settled=0;took=null;tookLast(e){return this.took?.from===e&&this.took.at===e.settled}takeOver(e){let t=Nx(e.stack.pieces);this.byId.clear();for(let e of t)this.byId.set(e.id,e);this.stack.pieces.length=0,this.stack.pieces.push(...t),this.stack.lastStack=e.stack.lastStack,this.asked=e.asked,this.took={from:e,at:e.settled}}constructor(e=new Map){this.assets=e}left=null;keep(e){let t=this.left;if(!t)return null;let n=this.stack,r=Nx(n.pieces);for(let e of r)e.asset=null;return{stamp:e,asked:t.asked.map(e=>({id:e.id,type:e.type,v:e.v,x:e.x,y:e.y,rot:e.rot,lift:e.lift})),spread:n.spread.slice(),bends:{...n.bends},sliceTop:t.sliceTop,bread:n.bread,pieces:r,lastStack:n.lastStack,settles:kb(),last:n.settleMark,grids:__(n.grids),gridsBelow:__(n.gridsBelow),gridsBelowOf:n.gridsBelowOf?.id??null,plateLog:n.plateLog.slice(),passes:t.passes,fine:t.fine}}takeKept(e,t,n){let r=this.stack;if(this.byId.size>0||e.stamp!==n||!Ex(e,t,r.bread,{...r.bends,...t.bends}))return!1;let i=e.pieces.map(e=>this.assets.get(Ax(e.type,e.v)));return!i.some(e=>!e)&&(e.pieces.forEach((e,t)=>{e.asset=i[t],this.byId.set(e.id,e)}),r.pieces.length=0,r.pieces.push(...e.pieces),r.lastStack=e.lastStack,v_(r.grids,e.grids),v_(r.gridsBelow,e.gridsBelow),r.gridsBelowOf=e.gridsBelowOf===null?null:this.byId.get(e.gridsBelowOf)??null,r.laidAlone=null,r.plateLog.length=0,r.plateLog.push(...e.plateLog),r.settleMark=e.last,Ab(e.settles),!0)}settle(e){return Wb(this.settleSteps(e))}seek(e){let t=performance.now(),n=e.seek;for(let[t,n]of Object.entries(e.assets))this.assets.set(t,n);let r=this.stack,i=e.pieces[e.pieces.length-1],a=i&&this.assets.get(Ax(i.type,i.v)),o=new Set(n.moved??[]),s=new Map(r.pieces.map(e=>[e.id,e])),c=[],l=0,u=!!i&&!!a&&n.spots.length>0;for(let t of e.pieces.slice(0,-1)){if(!u)break;let e=s.get(t.id);if(e){u=e===r.pieces[l++]&&e.lift===0&&t.lift===0&&(o.has(e.id)||e.x===t.x&&e.y===t.y&&e.rot===t.rot),c.push(e);continue}let n=o.has(t.id)&&t.lift===0?this.assets.get(Ax(t.type,t.v)):void 0;if(!n)u=!1;else{let e=r.piece(t.type,t.v,n,t.x,t.y,t.rot);e.id=t.id,c.push(e)}}if(!i||!a||!u||l!==r.pieces.length)return{result:{seq:e.seq,passes:0,ms:performance.now()-t,pieces:[],gridsBelowOf:null,lastStack:r.lastStack,plateLog:[],slips:null,seek:null},transfer:[]};let d=r.pieces.slice();r.pieces.length=0,r.pieces.push(...c),Vf(e.sliceTop),Object.assign(r.bends,e.bends),r.shell=!0,r.probe=!0,r.fine=!1,r.shellRounds=60;let f=r.piece(i.type,i.v,a,i.x,i.y,i.rot);f.id=i.id,r.pieces.push(f),r.put=e.put===f.id?f:null,v_(r.gridsBelow,n.grids),r.gridsBelowOf=f;let p={spots:n.spots,next:0,slid:[],least:1/0,at:n.spots[0],...n.want?{want:n.want,lead:n.lead}:{}};kx(r,f,p,n.checks,n.apart,t+n.ms);let[m,h]=p.at;(f.x!==m||f.y!==h)&&(f.x=m,f.y=h,r.settleTop());let g=r.slideDir(f),_=Lx(r,e.seq,0,performance.now()-t,void 0,g,f);if(_.result.seek={at:p.at,asked:p.slid.length+(p.held??+!g)},g){let e=[],t=r.slipTop(f,g,e);_.result.topSlide=t?{id:f.id,to:t,path:e,...r.slidLand?{land:r.slidLand}:{},...r.slidSteps?{steps:r.slidSteps}:{}}:null}return r.takeOff(f),r.pieces.length=0,r.pieces.push(...d),_}*slideSteps(e){let t=performance.now();for(let[t,n]of Object.entries(e.assets))this.assets.set(t,n);let n=this.stack,r=r=>({result:{seq:e.seq,passes:0,ms:performance.now()-t,pieces:[],gridsBelowOf:null,lastStack:n.lastStack,plateLog:[],slips:null,...r===void 0?{}:{topSlide:r}},transfer:[]}),i=e.pieces[e.pieces.length-1],a=i&&this.assets.get(Ax(i.type,i.v));if(!i||!a||!n.bread)return r();let o=n.pieces.slice(),s=o.filter(e=>e.id!==i.id),c=e.pieces.slice(0,-1);if(s.length!==c.length||!s.every((e,t)=>e.id===c[t].id&&e.lift===0&&c[t].lift===0&&e.x===c[t].x&&e.y===c[t].y&&e.rot===c[t].rot))return r();let l=o.find(e=>e.id===i.id)??n.piece(i.type,i.v,a,i.x,i.y,i.rot),u={x:l.x,y:l.y,rot:l.rot,lift:l.lift};l.id=i.id,l.x=i.x,l.y=i.y,l.rot=i.rot,l.lift=0,n.pieces.length=0,n.pieces.push(...s,l),Vf(e.sliceTop),Object.assign(n.bends,e.bends),n.put=e.put===l.id?l:null,v_(n.gridsBelow,e.slide.grids),n.gridsBelowOf=l;try{n.bendOf(l)===0&&n.lay(l,n.gridsBelow,!1);let t=[],i=n.slipTopSteps(l,e.slide.dir,t),a=0;for(;;){let o=i.next();if(o.done){let i=o.value,a=i&&$[l.type].drape&&n.bendOf(l)===0&&n.bread[m_(i[0],i[1])]===1?{...Lx(n,e.seq,0,0,void 0,null,l).result.pieces[0],bears:null,give:null}:void 0;return r(i?{id:l.id,to:i,path:t,...n.slidLand?{land:n.slidLand}:{},...n.slidSteps?{steps:n.slidSteps}:{},...a?{end:a}:{}}:void 0)}let s=t.length===a+2?t[a+1]:null;yield{news:{seq:e.seq,slideStep:{count:++a,at:[l.x,l.y],shape:o.value,pose:s}}}}}finally{Object.assign(l,u),n.pieces.length=0,n.pieces.push(...o),n.gridsBelowOf=null}}*settleSteps(e,t=!1,n){let r=performance.now();this.left=null;for(let[t,n]of Object.entries(e.assets))this.assets.set(t,n);let i=this.stack,a=!!n&&this.takeKept(n.stack,e,n.stamp),o=new Set(this.byId.keys()),s=e.pieces.map(e=>{let t=this.byId.get(e.id);if(!t){let n=this.assets.get(Ax(e.type,e.v));if(!n)throw Error(`no photo for ${Ax(e.type,e.v)}`);t=i.piece(e.type,e.v,n,e.x,e.y,e.rot),t.id=e.id,this.byId.set(e.id,t)}return t.x=e.x,t.y=e.y,t.rot=e.rot,t.lift=e.lift,t}),c=new Set(e.pieces.map(e=>e.id));for(let e of[...this.byId.keys()])c.has(e)||this.byId.delete(e);i.pieces.length=0,i.pieces.push(...s),i.spread.set(e.spread),Object.assign(i.bends,e.bends),i.shell=!0,e.bread&&(i.bread=e.bread),i.probe=!!e.probe,i.fine=a?n.stack.fine:!!e.fine&&!e.probe,i.shellRounds=e.probe&&!e.still?jx:60,Vf(e.sliceTop);let l=e.free===null?null:this.byId.get(e.free)??null;i.put=e.put==null?null:this.byId.get(e.put)??null,this.asked=e.pieces;let u=a?n.stack.passes:yield*i.settlePasses(l);this.settled++;let d=new Map;if(!t)for(let t of e.pieces)t.ver!==void 0&&o.has(t.id)&&d.set(t.id,t.ver);let f=i.pieces[i.pieces.length-1],p=f&&f!==l&&f.lift===0?i.slideDir(f):null,m=Lx(i,e.seq,u,performance.now()-r,d,p,e.probe?f:void 0);if(i.fine&&(m.result.fine=!0),!e.probe){let e=[],t=i.slipUnder(l,e);m.result.slip=t?{id:t.p.id,to:t.to,path:e}:null}if(e.slideTop){let e=f&&f.lift===0&&i.laidTop(f)?i.slideDir(f):null,t=[],n=e?i.slipTop(f,e,t):null;m.result.topSlide=n?{id:f.id,to:n,path:t,...i.slidLand?{land:i.slidLand}:{},...i.slidSteps?{steps:i.slidSteps}:{}}:null}if(a&&(m.result.taken=!0),!e.probe){let t=l===null&&e.pieces.length>0&&e.pieces.every(e=>e.lift===0)&&!m.result.slip&&!m.result.topSlide;this.left=t&&!a?{asked:e.pieces,sliceTop:e.sliceTop,passes:u,fine:i.fine}:null}return m}};function Nx(e){let t=new Map(e.map(e=>[e,{}])),n=e=>{if(typeof e!=`object`||!e)return e;if(ArrayBuffer.isView(e))return e.slice();let r=t.get(e);if(r)return r;if(Array.isArray(e))return e.map(n);if(e instanceof Map)return new Map([...e].map(([e,t])=>[e,n(t)]));if(e instanceof Set)return new Set(e);if(e instanceof WeakMap)return;let i={};for(let[t,r]of Object.entries(e))i[t]=n(r);return i};for(let[e,r]of t){for(let[t,i]of Object.entries(e))r[t]=t===`asset`?i:n(i);r.restFor&&e.restFor?.yield===e.yield&&(r.restFor.yield=r.yield)}return[...t.values()]}function Px(e,t){if(e.length!==t.length||e.length===0)return!1;let n=e.length-1;for(let r=0;r<e.length;r++){let i=e[r],a=t[r];if(i.id!==a.id||i.lift!==a.lift||r<n&&(i.x!==a.x||i.y!==a.y||i.rot!==a.rot))return!1}return!0}function*Fx(e){return e}var Ix=class{assets=new Map;core=new Mx(this.assets);probeCore=new Mx(this.assets);settleSteps(e,t){return e.bread&&(this.core.stack.bread=this.probeCore.stack.bread=e.bread),e.slide?this.core.slideSteps(e):e.seek?Fx(this.core.seek(e)):e.probe?(this.probeCore.tookLast(this.core)||this.probeCore.takeOver(this.core),this.probeCore.settleSteps(e)):!this.probeCore.tookLast(this.core)||!Px(this.probeCore.asked,e.pieces)?this.core.settleSteps(e,!1,t):([this.core,this.probeCore]=[this.probeCore,this.core],this.core.settleSteps(e,!0))}settle(e,t){return Wb(this.settleSteps(e,t))}keep(e){return this.core.keep(e)}};function Lx(e,t,n,r,i,a=null,o){let s=[],c=e=>(s.push(e.buffer),e),l=e=>e?c(e.slice()):null,u=(e,t)=>c(Float32Array.from(e,e=>t[e])),d=e=>{let t=__(e);return s.push(t.sup.buffer,t.flat.buffer,t.owner.buffer,t.bottom.buffer,t.beneath.buffer,t.beneathOwner.buffer),t},f={seq:t,passes:n,ms:r,pieces:(o?[o]:e.pieces).map(t=>{let n=i?.get(t.id)===t.ver,r=t.xyz.length>0&&!n;return{id:t.id,ver:t.ver,same:n,base:t.base,ax:t.ax,ay:t.ay,capped:t.capped,grips:t.grips,hull:t.hull,stuck:t.stuck,hold:t.hold,tips:e.tipping(t),tucked:t.tucked??null,on:t.on.map(e=>({id:e.q.id,x:e.x,y:e.y,r:e.r,...e.t?{t:!0}:{}})),com:t.com,yield:t.yield,sink:t.sink??0,xyz:r?l(t.xyz):null,fold:r?l(t.fold):null,shift:r?l(t.shift):null,shiftMax:t.shiftMax??0,ground:r?l(t.ground):null,flatAt:t.flatAt,held:r?l(t.held):null,bears:t.bears?{count:t.bears.cells.length,on:l(t.bears.on)}:null,give:t.bears&&t.give?u(t.bears.cells,t.give):null}}),gridsBelowOf:e.gridsBelowOf?.id??null,lastStack:e.lastStack,plateLog:e.plateLog.slice(),slips:a};return o||(f.grids=d(e.grids),f.gridsBelow=d(e.gridsBelow)),{result:f,transfer:s}}function Rx(e,t,n,r){t.base=n.base,t.ax=n.ax,t.ay=n.ay,t.capped=n.capped,t.grips=n.grips,t.hull=n.hull,t.stuck=n.stuck,t.hold=n.hold,t.tips=n.tips,t.tucked=n.tucked??void 0,t.on=n.on.flatMap(e=>{let t=r.get(e.id);return t?[{q:t,x:e.x,y:e.y,r:e.r,...e.t?{t:!0}:{}}]:[]}),t.com=n.com,t.yield=n.yield,t.sink=n.sink,n.same||(n.xyz&&(t.xyz=n.xyz,t.fold=n.fold,t.shift=n.shift,t.shiftMax=n.shiftMax,t.ground=n.ground??void 0,t.flatAt=n.flatAt,t.held=n.held??void 0,t.draped=void 0,t.drawnIn=void 0),t.ver++);let i=e.cellsUnder(t);if(t.give&&t.bears)for(let e of t.bears.cells)t.give[e]=0;if(n.bears&&n.bears.count===i.length){t.bears={cells:i,on:n.bears.on};let e=t.give??=new Float32Array(16384);if(n.give)for(let t=0;t<i.length;t++)e[i[t]]=n.give[t]}else t.bears=void 0;t.restFor=null,t.lie=n.same&&t.lie?.at!==t.ver?void 0:{ver:n.ver,at:t.ver}}function zx(e,t){let n=new Map(e.pieces.map(e=>[e.id,e]));for(let r of t.pieces){let t=n.get(r.id);!t||t.lift>0||Rx(e,t,r,n)}t.grids&&v_(e.grids,t.grids),t.gridsBelow&&v_(e.gridsBelow,t.gridsBelow),e.gridsBelowOf=t.gridsBelowOf===null?null:n.get(t.gridsBelowOf)??null,e.laidAlone=null,e.lastStack=t.lastStack,e.plateLog.length=0,e.plateLog.push(...t.plateLog)}var Bx=500;function Vx(e=Bx){let t=new Float64Array(4096),n=performance.now(),r=0;for(let n=0;n<e;n++)for(let e=0;e<t.length;e++)t[e]=Math.sqrt(t[e]+e+n)*.5+r*1e-9,r+=t[e];return r>0?(performance.now()-n)*Bx/e:0}var Hx=class{cores=new Ix;settle(e,t,n){let r;try{r=this.cores.settle(e).result}catch(e){console.error(`stack settle`,e),queueMicrotask(()=>n(String(e)));return}queueMicrotask(()=>t(r))}says(){return`in der Seite`}},Ux=class{worker;waiting=null;superseded=null;broken=null;made=performance.now();ready=null;asked=0;threadPace=null;pagePace=null;constructor(e=``,t=!1){this.worker=new Worker(new URL(`./stack.worker-Bqna4pHg.js`,import.meta.url),{type:`module`}),e&&this.worker.postMessage({stamp:e,again:t}),this.worker.onmessage=e=>{if(`ready`in e.data){this.ready=performance.now();return}if(`pace`in e.data){this.threadPace=e.data.pace;return}if(`laying`in e.data){this.waiting?.seq===e.data.seq&&this.waiting.laying?.();return}if(`slideStep`in e.data){this.waiting?.seq===e.data.seq&&this.waiting.news?.(e.data.slideStep);return}let t=this.superseded;if(t&&e.data.seq===t.seq){this.superseded=null,`failed`in e.data||t.done(e.data);return}let n=this.waiting;n&&e.data.seq===n.seq&&(this.waiting=null,`failed`in e.data?(console.error(`stack worker`,e.data.failed),I(`Setzen`,e.data.failed),n.failed(e.data.failed)):n.done(e.data))},this.worker.onerror=e=>{console.error(`stack worker`,e.message),this.broken=e.message||`thread error`;let t=this.waiting;this.waiting=null,this.superseded=null,this.worker.terminate(),I(`Thread`,this.broken),t?.failed(this.broken)}}settle(e,t,n,r,i){if(this.broken!==null){let e=this.broken;queueMicrotask(()=>n(e))}else this.superseded=this.waiting?{seq:this.waiting.seq,done:this.waiting.done}:null,this.waiting={seq:e.seq,done:t,failed:n,laying:r,news:i},this.asked=performance.now(),this.worker.postMessage(e,[e.spread.buffer])}says(e){this.pagePace===null&&(this.pagePace=Vx(),this.broken===null&&this.worker.postMessage({pace:!0}));let t=e=>e===null?`–`:`${e.toFixed(1)} ms`,n=this.ready===null?`kein Lebenszeichen seit ${Math.round(e-this.made)} ms`:`läuft nach ${Math.round(this.ready-this.made)} ms`,r=this.waiting;return`${n}, Takt ${t(this.threadPace)} (Seite ${t(this.pagePace)})${this.broken===null?``:` · kaputt: ${this.broken}`}${r?` · Anfrage ${r.seq} wartet ${Math.round(e-this.asked)} ms`:``}`}},Wx=.005/11;function Gx(e,t){return e*(1-Math.min(1,Math.max(0,t/300)))**3}var Kx=2/11,qx=.2/11,Jx=e=>1e3*Math.sqrt(2*e/$S);function Yx(e,t,n){let r=n/1e3,i=t+$S*r,a=(t+i)/2*r;return a>=e?{down:Math.max(0,e),speed:0}:{down:a,speed:i}}function Xx(e,t,n){if(e?.high&&e.ms&&t>0){let r=Math.min(1,Math.max(0,(n-e.start)/e.ms)),i=t+e.from*r*r;return{from:i,start:e.start,high:!0,ms:Jx(i)}}return t>Kx?{from:t,start:n,high:!0,ms:Jx(t)}:{from:t,start:n}}var Zx=80,Qx=4/11,$x=.1/11,eS=80,tS=.3/11;function nS(e,t,n){return Math.abs(t)>tS&&(e-=t),e*=1-QC(n,e>0?60:20),Math.abs(e)<.005/11?0:e}var rS=.3,iS=150,aS=100,oS=40,sS=.07,cS=6,lS=6,uS=400,dS=700,fS=3,pS=6,mS=.18,hS=.15;function gS(e,t,n){let r=-1/0;for(let i of e)n[i]&&(r=Math.max(r,t[i]));return r}function _S(e,t,n){return e*Math.max(t,n)<=700}function vS(e,t,n,r){let i=0,a=0;for(let r of e)n[r]&&(a++,i+=t[r]);let o=1-a/Math.max(1,e.length);return a===0||o>hS?1/0:i/a+o*.1+r*.02}function yS(e){let t=Math.ceil(Hb(e)*128)+1,n=Math.cos(-e.rot),r=Math.sin(-e.rot),i=[];for(let a=-t;a<=t;a++){let o=-a/128;for(let s=-t;s<=t;s++){let t=s/128;Sy(e.asset,(t*n-o*r)/e.w+e.cx,e.cy-(t*r+o*n)/e.h)&&i.push(s,a)}}return Int16Array.from(i)}function bS(e,t,n){let r=[];for(let i=0;i<e.length;i+=2){let a=t+e[i],o=n+e[i+1];a>=0&&a<128&&o>=0&&o<128&&r.push(o*128+a)}return r}var xS=50,SS=300,CS=19,wS=[[0,2,1,3],[1,0,2,3],[2,0,1,3],[3,0,2,1]];function TS(e,t,n){let r=(e,n)=>Math.max(t.left-e,e-t.right,0)+Math.max(t.top-n,n-t.bottom,0),i=n,a=1/0;for(let t of wS[n]){let n=r(...e[t]);if(!(n>=a)&&(a=n,i=t,n===0))break}let[o,s]=e[i];return{side:i,x:Math.min(t.right,Math.max(t.left,o)),y:Math.min(t.bottom,Math.max(t.top,s))}}function ES(e,t,n=340){let r=Math.min(1,Math.max(0,t/n));return e*(1-r*r)}var DS=96,OS=8,kS=new Z(0,0,1),AS=.08,jS=.05,MS=.09,NS=.01/11,PS=.3,FS=.45,IS=28,LS=12,RS=.4/11,zS=.001/11,BS=.15/11,VS=3,HS=6,US=(e,t)=>e<VS||t&&e<HS,WS=600,GS=.5/11,KS=1.6/11,qS=30,JS=.6,YS=1/11,XS=.5/11,ZS=.5/11,QS=.2/11,$S=400/11,eC=600,tC=.1,nC=600,rC=.3/11,iC=4,aC=320,oC=200,sC=60,cC=220,lC=6,uC=70,dC=.2/11,fC=.02/11,pC=.1/11,mC=Math.PI/180,hC=80,gC=150,_C=.5,vC=.01/11,yC=3/11,bC=.05/11,xC=.35;function SC(e,t,n,r,i){if(e===null)return{ask:!0,held:!1};let a=n&&!i;return{ask:e>=hC&&(t||r===!1)||a&&e>=gC,held:!a}}function CC(e,t=xC){if(e<=t)return 1;let n=Math.hypot(1,e);return t/(e/n+t*(1-1/n))}var wC=160,TC=.1/11,EC=3,DC=8;function OC(e,t,n,r){if(Math.hypot(e.x-t.x,e.y-t.y)>n)return!1;let i=Math.abs((e.rot-t.rot+Math.PI)%(2*Math.PI)-Math.PI);return Math.min(i,2*Math.PI-i)<=r}function kC(e,t,n,r){let i=n-1,a=Math.min(1,Math.max(0,e))*t;if(!r){let e=Math.max(0,Math.min(i,Math.floor(a)));return{i:e,f:e<i?a-e:0}}let o=0;for(;o<i&&r[o+1]<=a;)o++;return{i:o,f:o<i?Math.min(1,(a-r[o])/(r[o+1]-r[o])):0}}var AC=.35;function jC(e,t,n){return Math.max(Math.hypot(t.x-e.x,t.y-e.y),AC*Math.abs(t.base-e.base),n*Math.hypot(t.ax-e.ax,t.ay-e.ay))}function MC(e,t){let n=0,r=0;for(let i=1;i<e.length;i++)n+=jC(e[i-1],e[i],t),r+=Math.hypot(e[i].x-e[i-1].x,e[i].y-e[i-1].y);return{way:n,along:r}}function NC(e,t,n=0){let r=0;for(let t=1;t<e.length;t++)r+=jC(e[t-1],e[t],n);let i=t*r;for(let t=1;t<e.length;t++){let r=e[t-1],a=e[t],o=jC(r,a,n);if(i>o&&t<e.length-1){i-=o;continue}let s=o>0?Math.min(1,i/o):1;return{x:r.x+(a.x-r.x)*s,y:r.y+(a.y-r.y)*s,base:r.base+(a.base-r.base)*s,ax:r.ax+(a.ax-r.ax)*s,ay:r.ay+(a.ay-r.ay)*s}}return{...e[e.length-1]}}var PC=e=>1-(1-e)*(1-e),FC=.65,IC=e=>e<FC?e*e/FC:1-(1-e)*(1-e)/.35,LC=e=>e<=0?0:e>=1?1:e<FC?Math.sqrt(e*FC):1-Math.sqrt((1-e)*.35),RC=e=>Math.min(1,Math.max(0,e)*Math.max(0,e)/FC),zC=e=>Math.sqrt(Math.min(1,Math.max(0,e))*FC),BC=(e,t)=>t>0?2*e/(Math.sqrt(FC)*t):0,VC=(e,t)=>(e.off?RC:IC)(Math.min(1,Math.max(0,(t-e.start)/e.ms))),HC=63/11,UC=.15,WC=.08,GC=200,KC=1200,qC=Om;function JC(e,t){let n=HC*Math.max(WC,t/Math.hypot(1,t)-UC);return Math.min(KC,Math.max(GC,1e3*Math.sqrt(2*e/(n*FC))))}var YC=e=>e*e;function XC(e,t,n,r){return n===void 0?t<1?Math.min(1,Math.max(0,(e-t)/(1-t))):1:Math.min(1,Math.max(0,(r-n)/150))}function ZC(e,t,n,r){let i=e.pts[t],a=e.pts[t+1],o=e.pts[t+2],s=(n[0]*i+n[4]*a+n[8]*o+n[12]+.5)*128-.5,c=(.5-(n[1]*i+n[5]*a+n[9]*o+n[13]))*128-.5;return s<0||c<0||s>127||c>127?-1/0:r[Math.floor(c)*128+Math.floor(s)]+e.under-(n[2]*i+n[6]*a+n[10]*o+n[14])}var QC=(e,t)=>1-Math.exp(-Math.min(50,Math.max(0,e))/t),$C=1/11,ew=50,tw=.2/11,nw=.02/11;function rw(e,t,n,r,i,a,o){if(!e(t,n))return 0;let s=a;for(;s<o&&e(t-s*r,n-s*i);)s+=a;return Math.min(s,o)}function iw(e){let t=new Map;for(let n of e)t.set(n.id,n.converged);for(let e of t.values())if(!e)return!0;return!1}var aw=e=>iC*Math.PI/180*Math.sin(2*Math.PI*e/aC);function ow(e){let t=1/0,n=-1/0;for(let r=2;r<e.length;r+=3)t=Math.min(t,e[r]),n=Math.max(n,e[r]);return[t,n]}var sw=.5/11,cw=8,lw=.25/11,uw=.002/11,dw=.85,fw=.5,pw=.5/11,mw=1.08,hw=.12/11;function gw(e,t,n){e.onBeforeCompile=e=>{e.uniforms.ownColour={value:t},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>
attribute float own;
varying float vOwn;
varying float vOwnUp;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>\nvOwn = own;\nvOwnUp = position.z / ${n.toFixed(5)};`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\nuniform vec3 ownColour;\nvarying float vOwn;\nvarying float vOwnUp;\n#define OWN_GAIN ${mw.toFixed(2)}`).replace(`#include <map_fragment>`,`#include <map_fragment>
diffuseColor.rgb = mix(diffuseColor.rgb, ownColour * OWN_GAIN * (0.85 + 0.15 * vOwnUp), vOwn);`)},e.customProgramCacheKey=()=>`own-rim|${n}`}var _w=`vFootAway = 0.5 - 0.5 * dot(normalize(mat3(modelMatrix) * objectNormal).xy, ${np(ep)});`,vw=`uniform highp sampler2D uFootHeight;
uniform highp sampler2D uFootMask;
uniform float uFootN;
uniform float uFootLift;
uniform float uFootTop;
varying float vFoot;
varying float vFootAway;
float footSpread(vec2 w) {
  ivec2 fc = ivec2(floor((w.x + 0.5) * uFootN), floor((0.5 - w.y) * uFootN));
  int fn = int(uFootN);
  bool onBread = fc.x >= 0 && fc.y >= 0 && fc.x < fn && fc.y < fn && texelFetch(uFootMask, fc, 0).r > 0.5;
  return onBread ? uFootTop + texelFetch(uFootHeight, fc, 0).r * uFootLift : 0.0;
}`;function yw(e){e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>
varying float vFoot;
varying float vFootAway;`).replace(`#include <color_fragment>`,`#include <color_fragment>
diffuseColor.rgb *= mix(mix(${dw.toFixed(3)}, ${fw.toFixed(3)}, clamp(vFootAway, 0.0, 1.0)), 1.0, smoothstep(0.0, 1.0, vFoot));`)}function bw(e,t){let n=e.geometry;n.getAttribute(`crown`)||n.setAttribute(`crown`,new Kr(n.userData.crown,1));for(let n of[e.material].flat()){let e=n.onBeforeCompile,r=`${n.customProgramCacheKey()}|foot`;n.onBeforeCompile=(r,i)=>{e.call(n,r,i),Object.assign(r.uniforms,t),r.vertexShader=r.vertexShader.replace(`#include <common>`,`#include <common>\nattribute float crown;\n${vw}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
{
  vec4 fw = modelMatrix * vec4(position, 1.0);
  float above = fw.z - footSpread(fw.xy);
  float top = above + (crown - position.z) * modelMatrix[2][2];
  vFoot = above / max(${uw.toExponential(6)}, min(${lw.toExponential(6)}, top));
}
${_w}`),yw(r)},n.customProgramCacheKey=()=>r}}function xw(e){let t=e.length,n=new Float32Array(t);for(let r=1;r<t;r++)n[r]=n[r-1]+Math.hypot(e[r][0]-e[r-1][0],e[r][1]-e[r-1][1]);return{along:n,total:n[t-1]+Math.hypot(e[0][0]-e[t-1][0],e[0][1]-e[t-1][1]),nearest:Rf(e)}}function Sw(e,t,n,r=0,i=e.length/t){for(let a=r;a<i;a+=3){let r=Math.max(e[a*t],e[(a+1)*t],e[(a+2)*t]);for(let i=a;i<a+3;i++)r-e[i*t]>n/2&&(e[i*t]=e[i*t]+n)}}function Cw(e,t,n,r){let i=t.map(t=>e.getAttribute(t)),a=t.map(()=>[]),o=t.indexOf(`euv`),s=r?e.getAttribute(`euv`).array:null,c=new Map,l=new Map,u=0,d=(e,t)=>(i.forEach((n,r)=>{let i=n.itemSize;for(let s=0;s<i;s++)a[r].push(n.array[e*i+s]+(r===o&&s===0?t:0))}),u++),f=[];for(let e=0;e<n.length;e+=3){let t=s?Math.max(s[n[e]*2],s[n[e+1]*2],s[n[e+2]*2]):0;for(let i=0;i<3;i++){let a=n[e+i],o=!!s&&t-s[a*2]>r/2,u=o?l:c,p=u.get(a);p===void 0&&u.set(a,p=d(a,o?r:0)),f.push(p)}}return{attrs:Object.fromEntries(t.map((e,t)=>[e,a[t]])),index:f}}function ww(e,t,n){return Math.max(1,Math.round(e/(t*(n.naturalWidth/n.naturalHeight))))}function Tw(e,t,n,r,i){let a=Math.min(t-1,Math.max(0,r*(t-1))),o=Math.min(n-1,Math.max(0,i*(n-1))),s=Math.min(t-2,Math.floor(a)),c=Math.min(n-2,Math.floor(o)),l=a-s,u=o-c,d=e[c*t+s+1],f=e[(c+1)*t+s];if(l+u<=1){let n=e[c*t+s];return n+l*(d-n)+u*(f-n)}let p=e[(c+1)*t+s+1];return p+(1-l)*(f-p)+(1-u)*(d-p)}function Ew(e,t){let n=[];return e.forEach((r,i)=>{let a=e[(i+1)%e.length],[o,s]=t(r[0],r[1]),[c,l]=t(a[0],a[1]),u=[];for(let[e,t]of[[o,c],[s,l],[o+s,c+l]])for(let n=Math.ceil(Math.min(e,t));n<=Math.max(e,t);n++){let r=(n-e)/(t-e);r>1e-4&&r<.9999&&u.push(r)}u.sort((e,t)=>e-t),n.push([r[0],r[1],i]);let d=0;for(let e of u)e-d<1e-4||(d=e,n.push([r[0]+(a[0]-r[0])*e,r[1]+(a[1]-r[1])*e,i+e]))}),n}function Dw(e,t,n){let r=new wo({map:e,alphaTest:.5});return r.alphaToCoverage=!0,r.defines={...t?{EDGE:``}:{},...n?{WALLED:``}:{}},r.onBeforeCompile=e=>{e.uniforms.edgeMap={value:t},e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Ow}`).replace(`#include <begin_vertex>`,`#include <begin_vertex>\n${kw}`),e.fragmentShader=e.fragmentShader.replace(`#include <common>`,`#include <common>\n${Aw}`).replace(`#include <map_fragment>`,jw)},r}var Ow=`attribute vec2 cuv;
attribute float blur;
varying vec2 vCuv;
varying float vBlur;
#ifdef EDGE
attribute vec2 euv;
varying vec2 vEuv;
#endif
#ifdef WALLED
attribute float edist;
varying float vEdist;
#endif`,kw=`vCuv = cuv;
vBlur = blur;
#ifdef EDGE
vEuv = euv;
#endif
#ifdef WALLED
vEdist = edist;
#endif`,Aw=`varying vec2 vCuv;
varying float vBlur;
#ifdef EDGE
varying vec2 vEuv;
uniform sampler2D edgeMap;
#endif
#ifdef WALLED
varying float vEdist;
#endif`,jw=`#ifdef EDGE
vec3 shapedColour = mix( texture2D( map, vCuv ).rgb, texture2D( edgeMap, vEuv ).rgb, vBlur );
#else
vec3 shapedColour = texture( map, vCuv, vBlur * 5.0 ).rgb;
#endif
#ifdef WALLED
float shapedAlpha = clamp( vEdist / max( fwidth( vEdist ), 1e-4 ) + 1.5, 0.0, 1.0 );
#else
float shapedAlpha = texture2D( map, vMapUv ).a;
#endif
diffuseColor *= vec4( shapedColour, shapedAlpha );`,Mw=.15,Nw=.004,Pw=.3/Math.hypot(.3,.7),Fw=.7/Math.hypot(.3,.7),Iw=Array.from({length:7},(e,t)=>{let n=t/6*3,r,i,a,o;if(n<=1){let e=n*Math.PI/2;r=Math.sin(e),i=1-Math.cos(e),a=0,o=1-(1-Fw)*Math.sin(e)}else if(n<=2)r=1,i=1,a=n-1,o=Fw;else{let e=(n-2)*Math.PI/2;r=Math.cos(e),i=1+Math.sin(e),a=1,o=Fw-(Fw+.5)*Math.sin(e)}return{o:r,c:i,m:a,nz:o,ns:Math.sqrt(Math.max(0,1-o*o))}}),Lw=65,Rw=-1e6;function zw(){let e=new Float32Array(Lw*Lw*3*4),t=new Pi(e,Lw,Lw*3,ve,ue);return t.minFilter=B,t.magFilter=B,t.generateMipmaps=!1,t.needsUpdate=!0,{tex:t,data:e,pose:new Tn}}var Bw=`uniform highp sampler2D uGrid;
// a vertex's one layer, and its top: its folds over that (the second block)
vec3 gridOne(ivec2 v) {
  return texelFetch(uGrid, v, 0).xyz;
}
vec3 gridPos(ivec2 v) {
  return texelFetch(uGrid, v, 0).xyz + texelFetch(uGrid, v + ivec2(0, ${Lw}), 0).xyz;
}
// its one layer where its top is drawn over it, what the rim and the underside hang from: on a steep
// part a folded sheet's layers stand along the normal, sideways (stack.ts drape), and hung from the
// one layer itself the rim stood 5 mm out from the photo's edge, a strip with the cucumber through
// the gap (Gregor's ham, 2026-11-07)
vec3 gridHang(vec3 one, vec3 fold) {
  return one + vec3(fold.xy, 0.0);
}
// a vertex's normal as three.js computes it for a PlaneGeometry (sheetNormals): each
// triangle's cross product (c - b) x (a - b), by area, summed on its corners, normalised;
// the 3 x 3 vertices about it read once (one past the grid's edge only for cells skipped);
// of its top (top), else of its one layer (its folds' steps not in it)
vec3 gridNormal(ivec2 v, bool top) {
  vec3 p[9];
  for (int dy = -1; dy <= 1; dy++) {
    for (int dx = -1; dx <= 1; dx++) {
      ivec2 u = clamp(v + ivec2(dx, dy), ivec2(0), ivec2(64));
      p[(dy + 1) * 3 + dx + 1] = top ? gridPos(u) : gridOne(u);
    }
  }
  vec3 sum = vec3(0.0);
  for (int dy = -1; dy <= 0; dy++) {
    for (int dx = -1; dx <= 0; dx++) {
      ivec2 a = v + ivec2(dx, dy);
      if (a.x < 0 || a.y < 0 || a.x >= 64 || a.y >= 64) continue;
      // the cell's corners a, b below it, c, d right of a; which of them v is
      int i = (dy + 1) * 3 + dx + 1;
      vec3 A = p[i];
      vec3 B = p[i + 3];
      vec3 C = p[i + 4];
      vec3 D = p[i + 1];
      bool isA = dx == 0 && dy == 0;
      bool isB = dx == 0 && dy == -1;
      bool isC = dx == -1 && dy == -1;
      bool isD = dx == -1 && dy == 0;
      if (isA || isB || isD) sum += cross(D - B, A - B);
      if (isB || isC || isD) sum += cross(D - C, B - C);
    }
  }
  float l = length(sum);
  return l > 0.0 ? sum / l : sum;
}
ivec2 gridVertex() {
  return ivec2(gl_VertexID % ${Lw}, gl_VertexID / ${Lw});
}`,Vw=`${Bw}
uniform vec4 uSheet;
struct GridAt { ivec2 a; ivec2 b; ivec2 c; vec3 w; };
GridAt gridAt(vec2 p) {
  float seg = ${64 .toFixed(1)};
  float fx = clamp((p.x / uSheet.x + uSheet.z) * seg, 0.0, seg - 1e-4);
  float fy = clamp((uSheet.w - p.y / uSheet.y) * seg, 0.0, seg - 1e-4);
  float c = floor(fx);
  float r = floor(fy);
  float u = fx - c;
  float v = fy - r;
  int ci = int(c);
  int ri = int(r);
  GridAt g;
  if (u + v <= 1.0) {
    g.a = ivec2(ci, ri); g.b = ivec2(ci + 1, ri); g.c = ivec2(ci, ri + 1);
    g.w = vec3(1.0 - u - v, u, v);
  } else {
    g.a = ivec2(ci + 1, ri + 1); g.b = ivec2(ci, ri + 1); g.c = ivec2(ci + 1, ri);
    g.w = vec3(u + v - 1.0, 1.0 - u, 1.0 - v);
  }
  return g;
}
vec4 gridRead(GridAt g, int block) {
  ivec2 o = ivec2(0, block * ${Lw});
  return texelFetch(uGrid, g.a + o, 0) * g.w.x + texelFetch(uGrid, g.b + o, 0) * g.w.y + texelFetch(uGrid, g.c + o, 0) * g.w.z;
}
float sheetGround(vec2 laid, vec3 n, float thick) {
  return gridRead(gridAt(laid - thick * n.xy), 1).w;
}
vec3 sheetFoot(vec3 S, vec3 n, float thick, float topZ, float ground) {
  return vec3(S.xy - thick * n.xy, min(topZ, max(S.z - thick * n.z, ground)));
}`,Hw=`attribute vec4 rimPt;
attribute vec3 rimOut;
attribute vec4 rimRound;
${Vw}
${vw}
uniform vec4 uRim;
uniform vec4 uPose;
vec3 rimP;
vec3 rimN;
float rimT;
void rimRow(vec3 T, vec3 S, vec3 n, vec2 out2, float thick, float ground, float fold, float j, float rows, float round) {
  float on = out2.x * n.x + out2.y * n.y;
  vec3 o = vec3(out2.x - on * n.x, out2.y - on * n.y, -on * n.z);
  float ol = length(o);
  if (ol > 0.0) o /= ol;
  vec3 B = sheetFoot(S, n, thick, T.z, ground);
  float r = max(0.0, dot(T - B, n));
  if (round > 0.0) {
    float rr = min(round, r / 2.0);
    float up = rimRound.w;
    float ns = sqrt(max(0.0, 1.0 - up * up));
    rimT = r > 0.0 ? (rr * rimRound.y + rimRound.z * (r - 2.0 * rr)) / r : 0.0;
    rimP = T + (B - T) * rimT + o * rr * rimRound.x;
    rimN = o * ns + n * up;
    return;
  }
  rimT = j / (rows - 1.0);
  float cs = cos(rimT * PI / 2.0);
  float sn = sin(rimT * PI / 2.0);
  float inward = fold * r * (1.0 - cs);
  float rise = fold * r * (1.0 - sn);
  rimP = (1.0 - fold) * (T + (B - T) * rimT) + fold * B + n * rise - o * inward;
  float s2 = (1.0 - fold) * ${Pw.toFixed(8)} + fold * cs;
  float u2 = (1.0 - fold) * ${Fw.toFixed(8)} - fold * sn;
  float l = length(vec2(s2, u2));
  rimN = (o * s2 + n * u2) / (l > 0.0 ? l : 1.0);
}
// where a point of the photo shows on the sheet: along its row by what the row it shows in has it moved, and
// along its column by the column it shows in (drawTexture draws the photo along each row and each column of the
// grid, not of the photo): read where it lies flat alone, a hanging sheet's rim stood off its corner, where
// the rows differ most, by a millimetre or two. (Where it lies flat it is not moved, drawn as the grid or on
// a hold's line: there it shows, nothing more to read; every slab's rim and every flat sheet's)
vec2 rimShown(vec2 p) {
  vec2 moved = gridRead(gridAt(p), 2).zw;
  if (moved == vec2(0.0)) return p;
  vec2 q = p + moved;
  for (int k = 0; k < 2; k++) {
    float x = p.x + gridRead(gridAt(vec2(p.x, q.y)), 2).z;
    float y = p.y + gridRead(gridAt(vec2(q.x, p.y)), 2).w;
    q = vec2(x, y);
  }
  return q;
}
void rimPlace() {
  vec2 b0 = rimPt.xy;
  vec2 t0 = rimPt.zw;
  vec2 b1 = rimShown(b0);
  vec2 t1 = rimShown(t0);
  GridAt gb = gridAt(b1);
  GridAt gt = gridAt(t1);
  vec4 B0 = gridRead(gb, 0);
  vec3 B1 = gridNormal(gb.a, false) * gb.w.x + gridNormal(gb.b, false) * gb.w.y + gridNormal(gb.c, false) * gb.w.z;
  vec3 T0 = gridRead(gt, 0).xyz + gridRead(gt, 1).xyz;
  float nl = length(B1);
  vec3 n = nl > 0.0 ? B1 / nl : B1;
  // the top tucked under the sheet, just below its surface (the sheet wins the depth test), and
  // its one layer, the bottom a thickness under that: where the sheet is there (not where it lies
  // flat moved by its shift: a folded sheet's layers stand along its normal, stack.ts drape)
  vec3 T = vec3(T0.xy, T0.z - 0.0004);
  vec3 S = gridHang(B0.xyz, gridRead(gb, 1).xyz);
  float thick = uRim.x;
  vec2 f = -thick * n.xy;
  float ground = sheetGround(b0, n, thick);
  rimRow(T, S, n, rimOut.xy, thick, ground, rimOut.z, float(gl_VertexID % int(uRim.z)), uRim.z, uRim.y);
  // the spread under its foot, as the page lifts the sheet: off the bread 0, far below
  vec2 fp = S.xy + f;
  float rc = cos(uPose.z);
  float rs = sin(uPose.z);
  float spread = footSpread(uPose.xy + vec2(fp.x * rc - fp.y * rs, fp.x * rs + fp.y * rc)) - uPose.w;
  vFoot = (rimP.z - spread) / ${lw.toExponential(6)};
}`;function Uw(e,t,n,r,i){let a=e.material,o={uGrid:{value:t.tex},uSheet:{value:new Tn(n.w,n.h,n.cx,n.cy)},uRim:{value:new Tn(r.thick,r.round,r.rows,r.strip&&r.round>0?1:0)},uPose:{value:t.pose}};a.onBeforeCompile=e=>{Object.assign(e.uniforms,o,i),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Hw}`).replace(`#include <uv_vertex>`,`rimPlace();
#include <uv_vertex>
#ifdef USE_MAP
if (uRim.w > 0.5) vMapUv = (mapTransform * vec3(uv.x, 1.0 - rimT, 1.0)).xy;
#endif`).replace(`#include <beginnormal_vertex>`,`vec3 objectNormal = rimN;`).replace(`#include <begin_vertex>`,`vec3 transformed = rimP;\n${_w}`),yw(e)},a.customProgramCacheKey=()=>`sheet-rim`,e.frustumCulled=!1}var Ww=.008,Gw=2,Kw=`
#if NUM_DIR_LIGHTS > 0
{
  // the height's slope along the photo's u and v, between two samples a texel of that level apart each way
  vec2 wetE = ${(2**Gw/2).toFixed(1)} / vec2(textureSize(map, 0));
  const vec3 wetL = vec3(0.3, 0.6, 0.1);
  float wetU = dot(textureLod(map, vMapUv + vec2(wetE.x, 0.0), ${Gw.toFixed(1)}).rgb - textureLod(map, vMapUv - vec2(wetE.x, 0.0), ${Gw.toFixed(1)}).rgb, wetL) / (2.0 * wetE.x);
  float wetV = dot(textureLod(map, vMapUv + vec2(0.0, wetE.y), ${Gw.toFixed(1)}).rgb - textureLod(map, vMapUv - vec2(0.0, wetE.y), ${Gw.toFixed(1)}).rgb, wetL) / (2.0 * wetE.y);
  // u's and v's gradients across the surface, from the picture's derivatives
  vec3 wetP1 = -dFdx(vViewPosition);
  vec3 wetP2 = -dFdy(vViewPosition);
  vec2 wetT1 = dFdx(vMapUv);
  vec2 wetT2 = dFdy(vMapUv);
  vec3 wetA = cross(wetP2, normal);
  vec3 wetB = cross(normal, wetP1);
  float wetDet = dot(wetP1, wetA);
  vec3 wetSlope = ((wetA * wetT1.x + wetB * wetT2.x) * wetU + (wetA * wetT1.y + wetB * wetT2.y) * wetV) * (${Ww.toFixed(4)} / (abs(wetDet) > 1e-12 ? wetDet : 1.0));
  vec3 wetN = normalize(normal - clamp(wetSlope, -1.0, 1.0));
  vec3 wetHalf = normalize(directionalLights[0].direction + normalize(vViewPosition));
  // only what the relief catches beyond the sheet's own face: a sheet tilted into the light's mirror image went pale all over
  float wetGlint = max(0.0, pow(max(dot(wetN, wetHalf), 0.0), 50.0) - pow(max(dot(normal, wetHalf), 0.0), 50.0));
  // the shadow looked up (again, for this term) only where there is a glint to shade
  if (wetGlint > 0.002) outgoingLight += wetGlint * 2.0 * uWet * uSpecTint * getShadowMask();
}
#endif`;function qw(e,t,n,r){let i={uGrid:{value:t.tex}},a=n>0?{uWet:{value:n},uSpecTint:r}:null;for(let t of[e.material,e.customDepthMaterial]){let n=t===e.customDepthMaterial;t.onBeforeCompile=e=>{Object.assign(e.uniforms,i),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Bw}`).replace(`#include <begin_vertex>`,`vec3 transformed = gridPos(gridVertex());`),n||(e.vertexShader=e.vertexShader.replace(`#include <beginnormal_vertex>`,`vec3 objectNormal = gridNormal(gridVertex(), true);`)),!n&&a&&(Object.assign(e.uniforms,a),e.fragmentShader=e.fragmentShader.replace(`#include <shadowmap_pars_fragment>`,`#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
uniform float uWet;
uniform vec3 uSpecTint;`).replace(`#include <opaque_fragment>`,`${Kw}\n#include <opaque_fragment>`))},t.customProgramCacheKey=()=>n?`sheet-depth`:a?`sheet-wet`:`sheet`}e.frustumCulled=!1}function Jw(e,t,n,r,i){let a=new wo({map:t,alphaTest:.5,side:1});a.alphaToCoverage=!0;let o={uGrid:{value:n.tex},uSheet:{value:new Tn(r.w,r.h,r.cx,r.cy)},uThick:{value:i}};a.onBeforeCompile=e=>{Object.assign(e.uniforms,o),e.vertexShader=e.vertexShader.replace(`#include <common>`,`#include <common>\n${Vw}\nuniform float uThick;\nvec3 underP;`).replace(`#include <beginnormal_vertex>`,`ivec2 uv0 = gridVertex();
vec3 objectNormal = gridNormal(uv0, false);
underP = sheetFoot(gridHang(gridOne(uv0), gridPos(uv0) - gridOne(uv0)), objectNormal, uThick, gridPos(uv0).z, sheetGround(position.xy, objectNormal, uThick));`).replace(`#include <begin_vertex>`,`vec3 transformed = underP;`)},a.customProgramCacheKey=()=>`sheet-under`;let s=new ji(e,a);return s.frustumCulled=!1,s}var Yw=e=>e.mesh.children.flatMap(e=>e.material);function Xw(e){return new xo({uniforms:{map:{value:e},fade:{value:BS},stand:{value:0}},vertexShader:`attribute float gap; varying vec2 vUv; varying float vGap; void main() { vUv = uv; vGap = gap; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`uniform sampler2D map; uniform float fade; uniform float stand; varying vec2 vUv; varying float vGap; void main() { float c = texture2D(map, vUv).a * (1.0 - smoothstep(0.0, fade, vGap)); gl_FragColor = vec4(c, c * stand, c, c); }`,transparent:!0,blending:5,blendEquation:104,depthTest:!1,depthWrite:!1})}function Zw(e){let t=e.ease;return{xyz:t?.xyz??e.xyz,fold:t?.fromFold&&t.fold&&e.fold?.length===t.fold.length?t.fold:e.fold??null}}function Qw(e,t){let n=ub(e.asset,Lw),r=1/0,i=-1/0;if(n.length*3!==t.length)return[r,i];for(let e=0;e<n.length;e++){if(!n[e])continue;let a=t[e*3+2];a<r&&(r=a),a>i&&(i=a)}return[r,i]}function $w(e,t){let n=ub(e.asset,Lw);if(n.length*3!==t.length)return 0;let r=0,i=0,a=0,o=0;for(let e=0,s=0;e<n.length;e++,s+=3)n[e]&&(r++,i+=t[s],a+=t[s+1],o+=t[s+2]);if(r===0)return 0;i/=r,a/=r,o/=r;let s=0,c=0,l=0,u=0,d=0;for(let e=0,r=0;e<n.length;e++,r+=3){if(!n[e])continue;let f=t[r]-i,p=t[r+1]-a,m=t[r+2]-o;s+=f*f,c+=f*p,l+=p*p,u+=f*m,d+=p*m}let f=s*l-c*c;return f>0?Math.hypot(u*l-d*c,d*s-u*c)/f:0}var eT=new Float64Array(4225),tT=new WeakMap;function nT(e,t,n){let r=tT.get(e);r||tT.set(e,r=new Map);let i=t*2+n,a=r.get(i);if(a)return a;let o=ub(e,t),s=new Int16Array(t*t).fill(-1),c=n===0?1:t,l=n===0?t:1;for(let e=0;e<t-1;e++){let n=t=>!!o[t*l+e*c]&&!!o[t*l+(e+1)*c],r=-1;for(let i=0;i<t;i++)n(i)&&(r=i),s[i*t+e]=r;r=-1;for(let i=t-1;i>=0;i--){n(i)&&(r=i);let a=s[i*t+e];r>=0&&(a<0||r-i<i-a)&&(s[i*t+e]=r)}}return r.set(i,s),s}var rT=e=>e.ease?.xyz?!!e.ease.flat:e.flatAt!==null,iT=(e,t)=>!!t?.xyz&&t.xyz.length===e.xyz.length,aT=(e,t)=>e?.length===t?e:new Float32Array(t),oT=e=>({frame:e.frame,layers:e.layers,alpha:e.alpha,aw:e.aw,ah:e.ah,shape:e.shape}),sT=class{stage;assets;opts;stack=new Xb;host;geometries=new Map;variants=new Map;bender;bendSeq=0;bending=new Map;photoPixels=new Map;nextVariant=new Map;edgeTextures=new Map;photoTextures=new Map;selected=null;handle;handleSide=0;turning=!1;settleQueued=null;ticks=0;down=[];goingTo=new WeakMap;taps=[];tapSettled=!1;tapNext=0;tapEach=0;tapping=null;heldKey=null;tappedAt=-1/0;avoid=null;settleAfter=0;settler;settleSeq=0;pending=null;dropped=null;holdNext=!1;restNext=!1;loadNext=!1;keptLaid=Promise.resolve();sayKeptLaid=null;again=!1;finishing=null;fineFor=null;fineFree=void 0;fineDue=null;fineSlide=!1;threadError=null;threadSays(e){return this.settler.says(e)}afterSettle=[];idlers=[];sentAssets=new Set;sentBread=!1;breadMask=null;warmed=new Set;warmMaterials=new Map;sliding=null;hovering=null;falling=[];met=null;shove=null;knifeHit=new Z;probing=null;probeAfter=0;letGone=null;spreadSampled=null;drawnQuad=new Float32Array(16384).fill(-1/0);drawnFrom={near:[],read:[]};readingRest=!1;readCells=new Int32Array(16384);readTops=new Float32Array(16384);placeCues=[];axis=new Z;pivot=new Z;rock=new on;settleLog=[];probeLog=[];normal=new Z;turn=new on;turnEnd=0;lastTick=0;hitAt=new Z;carry=null;carryHit=new Z;drawHit=new Z;levelHit=new Z;lostPose={x:0,y:0,rot:0,w:0,h:0,cx:0,cy:0,asset:null};aside={p:null,x:0,y:0};constructor(e,t,n,r){this.stage=e,this.host=t,this.assets=n,this.opts=r,this.handle=document.createElement(`div`),this.handle.className=`turn-handle`,this.handle.style.display=`none`,t.appendChild(this.handle),this.bindHandle(),this.settler=r.settler}get placed(){return this.stack.pieces}get height(){let e=zf;for(let t of this.placed)t.gone||(e=Math.max(e,this.stack.topOf(t)-t.lift));return e-zf}get picked(){return this.selected!==null}get dragging(){return this.drags>0}drags=0;get carrying(){let e=this.placed[this.placed.length-1];return!!e&&e.lift>0&&!e.gone}wiggleHandle(){this.handle.style.display!==`none`&&xx(this.handle,`wiggle`)}whenKeptLaid(){return this.keptLaid}get gliding(){return this.placed.some(e=>!!e.ease||!!e.drop)}keptIsLaid(){this.sayKeptLaid?.(),this.sayKeptLaid=null}get items(){return this.placed.map(e=>({type:e.type,x:e.x,y:e.y,rot:e.rot,...e.v===void 0?{}:{v:e.v}}))}get ids(){return this.placed.map(e=>e.id)}coversTilted(e,t){return this.stack.coversOnPlane(e,t.x,t.y,e.ax,e.ay,t.z-e.base-e.lift)}edgeWall(e,t,n,r,i,a,o){let s=e.getAttribute(`position`),c=e.getAttribute(`normal`),l=e.getAttribute(`uv`),u=n.length,{along:d,total:f,nearest:p}=xw(n),m=0;for(let e=0;e<u;e++)m+=n[e][0]*n[(e+1)%u][1]-n[(e+1)%u][0]*n[e][1];let h=m>0?1:-1,g=n.map((e,t)=>{let r=n[(t+u-1)%u],i=n[(t+1)%u],a=i[0]-r[0],o=i[1]-r[1],s=Math.hypot(a,o)||1;return[h*o/s,-h*a/s]}),_=ww(f,r,i),v=a/11,y=new Int32Array(t.count);for(let e=t.start;e<t.start+t.count;e++){let n=y[e-t.start]=p(s.getX(e),s.getY(e)),i=s.getZ(e);l.setXY(e,d[n]/f*_,i/r);let[o,u]=g[n],m=v*(Math.sin(Math.PI*i/r)-1)-(a>0?.005/11:0),h=v*Math.PI/r*Math.cos(Math.PI*i/r),b=Math.hypot(1,h);s.setXY(e,s.getX(e)+o*m,s.getY(e)+u*m),c.setXYZ(e,o/b,u/b,-h/b)}Sw(l.array,2,_,t.start,t.start+t.count),o&&this.ownRim(e,t,y,n,d,f,g,i,o),s.needsUpdate=!0,c.needsUpdate=!0,l.needsUpdate=!0}ownRim(e,t,n,r,i,a,o,s,c){let{photo:l,w:u,h:d,cx:f,cy:p}=c,m=rf(s,64,8),h=[0,0,0];for(let e=0;e<512;e++)for(let t=0;t<3;t++)h[t]+=m[e*4+t]/512;let g=Math.max(1,Math.round(256*d/u)),_=rf(l,256,g),v=r.length,y=.1/11,b=r.map(([e,t],n)=>{let r=Math.min(255,Math.max(0,Math.floor(((e-o[n][0]*y)/u+f)*256)));return(Math.min(g-1,Math.max(0,Math.floor((p-(t-o[n][1]*y)/d)*g)))*256+r)*4}),x=b.map(e=>Math.hypot(_[e]-h[0],_[e+1]-h[1],_[e+2]-h[2])),S=x.map((e,t)=>{let n=0;for(let e=-4;e<=4;e++)n+=x[(t+e+v)%v];return sx(60,110,n/9)}),C=e=>(e+1<v?i[e+1]:a)-i[e],w=S.map((e,t)=>{if(e<.5)return 0;let n=0;for(let e=t;S[e%v]>=.5&&n<1;e++)n+=C(e%v);let r=0;for(let e=t-1;S[(e+v)%v]>=.5&&r<1;e--)r+=C((e+v)%v);return 1-sx(pw/2-hw,pw/2+hw,Math.abs(n-r)/2)}),T=[0,0,0],E=0;b.forEach((e,t)=>{let n=w[t];if(!(n<.5)){for(let t=0;t<3;t++)T[t]+=_[e+t]/255*n;E+=n}}),e.userData.ownColour=E>0?T.map(e=>e/E):[1,1,1];let D=new Float32Array(e.getAttribute(`position`).count);for(let e=0;e<t.count;e++)D[t.start+e]=w[n[e]];e.setAttribute(`own`,new Kr(D,1))}shapeOf(e,t,n,r){let i=t.shape;if(!i){let a=$[e],o=Math.max(8,Math.round(DS*n/Math.max(n,r))),s=Math.max(8,Math.round(DS*r/Math.max(n,r))),c=new Float32Array(o*s);for(let e=0;e<s;e++)for(let n=0;n<o;n++)c[e*o+n]=xy(t.alpha,t.aw,t.ah,n/(o-1),e/(s-1))/255;let l,u=a.shape;if(u.kind===`hill`||u.kind===`round`&&u.relief){let e=rf(t.img,o,s);l=new Uint8ClampedArray(o*s*3);for(let t=0;t<o*s;t++)l.set(e.subarray(t*4,t*4+3),t*3)}let d=n*11/(o-1),f=this.outlineOf(t).map(([e,t])=>[e*(o-1),t*(s-1)]),p;if(u.kind===`round`&&u.extra&&t.relief){let e=rf(t.relief,o,s);p=Float32Array.from({length:o*s},(t,n)=>e[n*4]/255*u.extra)}i={gw:o,gh:s,...cx(a.shape,c,o,s,d,a.thick,l,f,p)},t.shape=i}return i}buildShaped(e,t,n,r,i,a,o){let s=$[e].shape,c=s.kind===`round`&&!!s.wall,l=$[e].edge&&t.edge?this.edgeTexture(t.edge):null,u=this.shapedGeometry(e,t,r,i,a,o),d=new wo({map:n});d.color=sp($[e].dim);let f=new ji(u,[Dw(n,l,c),d]);return f.customDepthMaterial=new To({map:n,alphaTest:.5,depthPacking:ft}),f}photos(){return[...this.photoTextures.values()].map(e=>e.tex)}photoTexture(e){let t=this.photoTextures.get(e);return t||(t={tex:Dp(e),pieces:0},this.photoTextures.set(e,t)),t.pieces++,t.tex}dropGeometry(e){e.mesh.geometry!==this.geometries.get(e.asset)&&e.mesh.geometry.dispose(),e.foot.geometry.dispose(),e.rim?.geometry.dispose(),e.grid?.tex.dispose(),this.dropPhoto(e)}dropPhoto(e){let t=this.photoTextures.get(e.asset.img);!t||--t.pieces>0||(t.tex.dispose(),this.photoTextures.delete(e.asset.img),this.dropVariant(e))}dropVariant(e){if(e.v===void 0||this.nextVariant.get(e.type)===e.v)return;let t=Ax(e.type,e.v),n=this.variants.get(t);n&&n===e.asset&&(this.variants.delete(t),this.geometries.get(n)?.dispose(),this.geometries.delete(n),n.img instanceof HTMLCanvasElement&&nf(n.img))}edgeTexture(e){let t=this.edgeTextures.get(e);return t||(t=Dp(e),t.wrapS=L,this.edgeTextures.set(e,t)),t}discGeometry(e,t,n,r,i,a){let o=this.geometries.get(t);if(o)return o;let s=$[e],c=s.thick/11,l=this.outlineOf(t).map(([e,t])=>[(e-i)*n,-(t-a)*r]),u=s.edge&&t.edge?s.edge:null,d=new ao(new xa(l.map(([e,t])=>new X(e,t))),{depth:c,bevelEnabled:!1,steps:u?.bulge?6:1}),f=d.getAttribute(`position`),p=d.getAttribute(`uv`);for(let e=0;e<f.count;e++)p.setXY(e,i+f.getX(e)/n,1-a+f.getY(e)/r);let m=d.groups.find(e=>e.materialIndex===1);if(d.userData.crown=new Float32Array(f.count).fill(c),m&&u)this.edgeWall(d,m,l,c,t.edge,u.bulge??0,u.own?{photo:t.img,w:n,h:r,cx:i,cy:a}:void 0);else if(m)for(let e=m.start;e<m.start+m.count;e++){let t=f.getX(e),o=f.getY(e),s=Math.hypot(t,o)||1,l=1-(f.getZ(e)>c/2?.03:.08)/11/s;p.setXY(e,i+t*l/n,1-a+o*l/r)}return this.geometries.set(t,d),d}shapedGeometry(e,t,n,r,i,a){let o=this.geometries.get(t);if(o)return o;let s=$[e],c=s.shape.kind===`round`&&!!s.shape.wall,l=!!(s.edge&&t.edge),{gw:u,gh:d,top:f,bot:p,dist:m}=this.shapeOf(e,t,n,r),h=u*d,g=new Float32Array(h*2*3),_=new Float32Array(h*2*2),v=new Float32Array(h*2*2),y=new Float32Array(h*2),b=n*11/(u-1),x=.2/b;for(let e=0;e<d;e++)for(let t=0;t<u;t++){let o=e*u+t,s=t/(u-1),c=e/(d-1);for(let[l,S]of[[0,f],[1,p]]){let f=l*h+o,p=S[o],C=(S[e*u+Math.min(u-1,t+1)]-S[e*u+Math.max(0,t-1)])/2,w=(S[Math.min(d-1,e+1)*u+t]-S[Math.max(0,e-1)*u+t])/2,T=l===0?1:-1,E=Math.hypot(C,w),D=E/b,O=E>1e-6?Math.min(1,D)*Math.max(0,x-m[o])/E:0;g.set([(s-i)*n,-(c-a)*r,p/11],f*3),_.set([s,1-c],f*2),v.set([s+T*C*O/(u-1),1-c-T*w*O/(d-1)],f*2),y[f]=sx(1,2.5,D)}}let S=[],C=(e,n)=>t.alpha[Math.round(n/(d-1)*(t.ah-1))*t.aw+Math.round(e/(u-1)*(t.aw-1))]>3;for(let e=0;e<d-1;e++)for(let t=0;t<u-1;t++){if(!(C(t,e)||C(t+1,e)||C(t,e+1)||C(t+1,e+1)))continue;let n=e*u+t,r=n+u,i=n+1,a=r+1;S.push(n,r,i,i,r,a),S.push(h+n,h+i,h+r,h+i,h+a,h+r)}let w=new si;w.setAttribute(`position`,new Kr(g,3)),w.setAttribute(`uv`,new Kr(_,2)),w.setAttribute(`cuv`,new Kr(v,2)),w.setAttribute(`blur`,new Kr(y,1));let T=this.outlineOf(t).map(([e,t])=>[(e-i)*n,-(t-a)*r]),E=1,D=null,O=null;if(l){let{along:e,total:n,nearest:r}=xw(T);E=ww(n,s.thick/11,t.edge),D=(t,i)=>e[r(t,i)]/n*E,O=t=>{let r=Math.floor(t),i=e[r];return(i+(t-r)*((e[r+1]??n)-i))/n*E};let i=new Float32Array(h*2*2);for(let e=0;e<h;e++){let t=D(g[e*3],g[e*3+1]);i.set([t,f[e]/s.thick],e*2),i.set([t,p[e]/s.thick],(h+e)*2)}w.setAttribute(`euv`,new Kr(i,2))}if(c){let e=new Float32Array(h*2);for(let t=0;t<h;t++)e[t]=e[h+t]=m[t]+1;w.setAttribute(`edist`,new Kr(e,1))}w.setIndex(S),w.computeVertexNormals();let k=Cw(w,[`position`,`normal`,`uv`,`cuv`,`blur`,...l?[`euv`]:[],...c?[`edist`]:[]],S,l?E:0);w.dispose();let A={pos:[],norm:[],uv:[],cuv:[],euv:[]};if(s.shape.kind===`shell`||c){let e=c?Ew(T,(e,t)=>[(i+e/n)*(u-1),(a-t/r)*(d-1)]):T,t=(e,t)=>`${Math.fround(e)},${Math.fround(t)}`,o=new Map(c?e.map(([e,n,r])=>[t(e,n),r]):[]),l=new ao(new xa(e.map(([e,t])=>new X(e,t))),{depth:1,bevelEnabled:!1,steps:c?2:1}),m=l.groups.find(e=>e.materialIndex===1),h=l.getAttribute(`position`),g=l.getAttribute(`normal`);for(let e=m.start;e<m.start+m.count;e++){let l=h.getX(e),m=h.getY(e),_=h.getZ(e)>.75,v=c&&!_&&h.getZ(e)>.25,y=_||v?Tw(f,u,d,i+l/n,a-m/r):0,b=_?0:Tw(p,u,d,i+l/n,a-m/r),x=_?y:v?y-(y-b)*Mw:b;if(A.pos.push(l,m,x/11),c&&_?A.norm.push(g.getX(e)*Pw,g.getY(e)*Pw,Fw):A.norm.push(g.getX(e),g.getY(e),g.getZ(e)),c){A.uv.push(i,1-a);let t=l-g.getX(e)*(.2/11),o=m-g.getY(e)*(.2/11);A.cuv.push(i+t/n,1-a+o/r)}else{let e=_?.985:.94;A.uv.push(i+l*e/n,1-a+m*e/r),A.cuv.push(i+l*e/n,1-a+m*e/r)}if(D){let e=o.get(t(l,m));A.euv.push(e===void 0?D(l,m):O(e),x/s.thick)}}l.dispose(),Sw(A.euv,2,E)}let j=k.attrs.position.length/3,M=k.index.length,N=A.pos.length/3,P=new si,F=(e,t,n)=>{let r=k.attrs[e],i=new Float32Array(r.length+n.length);i.set(r),i.set(n,r.length),P.setAttribute(e,new Kr(i,t))};F(`position`,3,A.pos),F(`normal`,3,A.norm),F(`uv`,2,A.uv),F(`cuv`,2,A.cuv),F(`blur`,1,new Float32Array(N).fill(+!!c)),l&&F(`euv`,2,A.euv),c&&F(`edist`,1,new Float32Array(N).fill(1)),P.setIndex([...k.index,...Array.from({length:N},(e,t)=>j+t)]),P.addGroup(0,M,0),P.addGroup(M,N,+!c);let I=P.getAttribute(`position`).array;return P.userData.crown=Float32Array.from({length:I.length/3},(e,t)=>{let o=i+I[t*3]/n,s=a-I[t*3+1]/r;return Math.max(xy(f,u,d,o,s),xy(p,u,d,o,s))/11}),this.geometries.set(t,P),P}outlineOf(e){return e.outline??=Pf(e.img)}buildRim(e,t,n,r,i,a,o,s,c,l=0){let u=this.outlineOf(e),d=u.length,f=(t,n)=>{let r=Math.floor(t*e.aw),i=Math.floor(n*e.ah);return r>=0&&i>=0&&r<e.aw&&i<e.ah&&e.alpha[i*e.aw+r]>=128},p=0;for(let e=0;e<d;e+=Math.max(1,Math.floor(d/40))){let t=u[(e+d-1)%d],n=u[(e+1)%d],r=u[e],i=-(n[1]-t[1]),a=n[0]-t[0],o=Math.hypot(i,a)||1;p+=f(r[0]+i/o*.02,r[1]+a/o*.02)?1:-1}let m=p>=0?1:-1,h=e.fold?9:l>0?7:2,g=(d+1)*h,_=[],v=[],y=new Float32Array(g*4),b=new Float32Array(g*3),x=[];for(let t=0;t<=d;t++){let o=u[t%d],s=u[(t+d-1)%d],c=u[(t+1)%d],l=-(c[1]-s[1])*m,f=(c[0]-s[0])*m,p=Math.hypot(l,f)||1;l/=p,f/=p;let g=(o[0]-i)*n,v=-(o[1]-a)*r,S=(o[0]+l*Nw-i)*n,C=-(o[1]+f*Nw-a)*r,w=-l*n,T=f*r,E=Math.hypot(w,T)||1;x.push(w/E,T/E);let D=e.fold?xy(e.fold,e.aw,e.ah,o[0],o[1]):0;for(let e=0;e<h;e++){let n=t*h+e;y[n*4]=g,y[n*4+1]=v,y[n*4+2]=S,y[n*4+3]=C,b[n*3+2]=D;let r=.01+.03*(e/(h-1));_.push(o[0]+l*r,1-(o[1]+f*r))}}if(l>0){let e=Math.max(2,Math.round(d/80)),t=x.slice();for(let n=0;n<=d;n++){let r=0,i=0;for(let a=-e;a<=e;a++){let e=(n+a+d)%d;r+=t[e*2],i+=t[e*2+1]}let a=Math.hypot(r,i)||1;x[n*2]=r/a,x[n*2+1]=i/a}}for(let e=0;e<=d;e++)for(let t=0;t<h;t++)b[(e*h+t)*3]=x[e*2],b[(e*h+t)*3+1]=x[e*2+1];let S=y[h*4+2]-y[2],C=(y[h*4+3]-y[3])*x[0]-S*x[1]>0;for(let e=0;e<d;e++)for(let t=0;t<h-1;t++){let n=e*h+t,r=n+1,i=n+h,a=i+1;C?v.push(n,r,i,r,a,i):v.push(n,i,r,r,i,a)}if(c){let{along:e,total:t}=xw(u.map(([e,t])=>[(e-i)*n,-(t-a)*r])),s=ww(t,o,c.img);for(let n=0;n<=d;n++){let r=n===d?s:e[n]/t*s;for(let e=0;e<h;e++)_[(n*h+e)*2]=r,_[(n*h+e)*2+1]=1-e/(h-1)}}let w=new Float32Array(g*4);if(l>0)for(let e=0;e<g;e++){let{o:t,c:n,m:r,nz:i}=Iw[e%h];w[e*4]=t,w[e*4+1]=n,w[e*4+2]=r,w[e*4+3]=i}let T=new si;T.setAttribute(`position`,new Kr(new Float32Array(g*3),3)),T.setAttribute(`normal`,new Kr(new Float32Array(g*3),3)),T.setAttribute(`uv`,new Yr(_,2)),T.setAttribute(`rimPt`,new Kr(y,4)),T.setAttribute(`rimOut`,new Kr(b,3)),T.setAttribute(`rimRound`,new Kr(w,4)),T.setIndex(v);let E=new ji(T,new wo({map:c?c.tex:t,color:c?16777215:15790320,side:2}));return Uw(E,s,{w:n,h:r,cx:i,cy:a},{thick:o,round:l,rows:h,strip:!!c},this.stage.footUniforms),E}drawTexture(e,t=e.xyz,n=e.fold,r=e.flatAt!==null){let i=e.mesh.geometry,a=i.getAttribute(`uv`),o=a.array,s=i.userData,c=s.baseUv??=Float32Array.from(o),l=()=>{e.texShift&&(o.set(c),a.needsUpdate=!0),e.texShift=null};if(r)return l();let u=e.lift>0?e.foresight?.hold:e.hold;u&&(e.lastHold=u);let d=e.lastHold?e.lastHold[0]/e.w+e.cx:e.comX,f=e.lastHold?e.cy-e.lastHold[1]/e.h:e.comY,p=s.texShift??=new Float32Array(8450),m=new Float64Array(65),h=new Float64Array(65),g=0,_=1,v=0,y=0,b=nT(e.asset,65,0),x=eT,S=()=>{for(let e=0;e<65;e++){let r=_===1?e*65:e;for(let i=0;i<64;i++){if(b[e*65+i]!==e)continue;let a=r+i*_,o=a+_,s=e=>t[o*3+e]-t[a*3+e]-(n?n[o*3+e]-n[a*3+e]:0);x[e*65+i]=Math.hypot(s(0),s(1),s(2))}}},C=e=>{let t=b[y*65+e];return t<0?v:x[t*65+e]},w=0;for(let t=0;t<2;t++){let n=Math.min(64,Math.max(0,Math.round((t===0?d:f)*64))),r=t===0?e.w:e.h,i=t===0?1:-1;v=r/64,_=t===0?1:65,b=nT(e.asset,65,t),S();for(let e=0;e<65;e++){y=e,g=t===0?e*65:e,Sx(m,65,n,v,C),Cx(m,65,n,v,h);let a=c[(g+n*_)*2+t];for(let e=0;e<65;e++){let n=g+e*_;o[n*2+t]=wx(a+i*m[e]/r);let s=i*(h[e]-e)*v;p[n*2+t]=s,w=Math.max(w,Math.abs(s))}}}if(w<zS)return l();a.needsUpdate=!0,e.texShift=p}writeGrid(e,t=e.xyz,n=e.fold){let r=e.grid;if(!r)return;let i=r.data,a=Lw*Lw,o=e.ground,s=e.texShift;for(let e=0;e<a;e++){let r=e*4,c=(a+e)*4,l=(2*a+e)*4;for(let a=0;a<3;a++){let o=n?n[e*3+a]:0;i[r+a]=t[e*3+a]-o,i[c+a]=o}i[c+3]=o?o[e]:Rw,i[l+2]=s?s[e*2]:0,i[l+3]=s?s[e*2+1]:0}r.tex.needsUpdate=!0}dropAt(e,t){let n=e.drop;return n?n.fall||n.high?ES(n.from,t-n.start,n.ms):Gx(n.from,t-n.start):0}showDrop(e,t){e.drop&&(e.rocked||(e.mesh.position.z=this.shownZ(e,t)),t-e.drop.start>=(e.drop.fall||e.drop.high?e.drop.ms??340:300)&&(e.drop=void 0))}fallIn(e=performance.now()){this.placed.forEach((t,n)=>{t.drop={from:rS,start:e+Math.min(n*xS,SS),fall:!0},this.showDrop(t,e)}),this.stage.needsRender=!0,this.stage.shadowsChanged()}slidingTop(){let e=this.sliding;return e&&e===this.placed[this.placed.length-1]&&e.lift===0?e:null}show(e,t){let n=$[e.type],r=this.easeNow(e,t);r&&(e.easedTick=this.ticks);let i=e.shown,a=!!i&&i.ver===e.ver&&i.x===e.x&&i.y===e.y&&i.rot===e.rot&&i.lift===e.lift,o=a&&i.base===e.base&&i.ax===e.ax&&i.ay===e.ay,s=this.aside.p===e?this.aside.x:0,c=this.aside.p===e?this.aside.y:0;if(n.drape){if(e.mesh.rotation.set(0,0,e.rot),e.mesh.position.set(e.x+s,e.y+c,this.shownZ(e,t)),a&&!r)return;let{xyz:n,fold:o}=Zw(e);r?.xyz&&r.tex&&!r.flat?this.drawTexture(e,n,o,!1):i?.ver!==e.ver&&this.drawTexture(e),(r?.xyz||i?.ver!==e.ver)&&this.writeGrid(e,n,o),e.grid?.pose.set(e.x,e.y,e.rot,e.lift)}else if(this.lean(e.mesh.quaternion,r?r.ax:e.ax,r?r.ay:e.ay,e.rot),e.mesh.position.set(e.x+s,e.y+c,this.shownZ(e,t)),o&&!r)return;o||this.layFoot(e),e.shown={ver:e.ver,x:e.x,y:e.y,rot:e.rot,lift:e.lift,base:e.base,ax:e.ax,ay:e.ay}}drawnNow(e,t,n=!0){let r=e.ease,i=this.shownZ(e,t);if($[e.type].drape){let{xyz:t,fold:r}=Zw(e),a=rT(e);return n?{xyz:t.slice(),fold:r?.slice()??null,z:i,ax:0,ay:0,flat:a,owned:!0}:{xyz:t,fold:r,z:i,ax:0,ay:0,flat:a}}return{xyz:null,fold:null,z:i,ax:r?r.ax:e.ax,ay:r?r.ay:e.ay}}startEase(e,t,n,r=!1){let i=this.shownZ(e,n),a=!1,o=0,s=null,c=null;if($[e.type].drape){if(!t.xyz||t.xyz.length!==e.xyz.length)return;let n=t.z-i,l=e.xyz,u=t.xyz,d=!!t.fold&&!!e.fold&&t.fold.length===e.fold.length;if(u!==l||Math.abs(n)>fC){for(let e=0;e<u.length;e+=3)o=Math.max(o,Math.abs(u[e]-l[e]),Math.abs(u[e+1]-l[e+1]),Math.abs(u[e+2]+n-l[e+2]));a=o>fC}if(!a&&d&&t.fold!==e.fold)for(let n=0;!a&&n<t.fold.length;n++)a=Math.abs(t.fold[n]-e.fold[n])>fC;if(a||r){let r=e.easeBuf??={from:null,xyz:null,fold:null};s=t.owned?u:r.from=aT(r.from,u.length);for(let e=0;e<u.length;e+=3)s[e]=u[e],s[e+1]=u[e+1],s[e+2]=u[e+2]+n;d&&(c=t.owned?t.fold:Float32Array.from(t.fold))}}else{let r=t.z-i;Math.abs(r)>fC&&(e.drop=Xx(e.drop,r+this.dropAt(e,n),n)),a=Math.max(Math.abs(t.ax-e.ax),Math.abs(t.ay-e.ay))*Math.max(e.w,e.h)>fC}if(!a&&!r){e.ease&&(e.ease=void 0,this.reshow(e,n));return}let l=e.easeBuf;e.ease={start:n,tex:o>dC||r||!!e.ease?.tex,flat:!!t.flat&&e.flatAt!==null,fromXyz:s,fromFold:c,fromAx:t.ax,fromAy:t.ay,xyz:s&&l?l.xyz=aT(l.xyz,s.length):null,fold:c&&l?l.fold=aT(l.fold,c.length):null,ax:t.ax,ay:t.ay};let u=e.ease;u.xyz&&s&&u.xyz.set(s),u.fold&&c&&u.fold.set(c)}followSlide(e,t,n,r){!e.ease&&t&&this.startEase(e,t,n,!0);let i=e.ease;if(!i?.fromXyz)return;let a=e.xyz;if(!i.to||i.to.length!==a.length){i.to=a.slice();return}let o=QC(r,uC),s=i.to,c=0;if(this.stack.bendOf(e)===0){let t=Qw(e,s)[1]-Qw(e,a)[1];if(t>Kx||i.falls&&t>0){let e=Yx(t,i.falls??0,r);i.falls=e.speed||void 0,c=t*o-e.down}else i.falls=void 0}for(let e=0;e<s.length;e++)s[e]+=(a[e]-s[e])*o+(c!==0&&e%3==2?c:0)}easeNow(e,t){let n=e.ease;if(!n)return;let r=(t-n.start)/cC;if(n.fromXyz&&n.fromXyz.length!==e.xyz.length){e.ease=void 0,e.shown=void 0;return}if(r>=1&&!n.to){e.ease=void 0,n.xyz&&(n.tex&&!n.flat&&this.drawTexture(e),this.writeGrid(e));return}let i=n.at===void 0?1-sx(0,1,r):1-n.at;if(n.fromXyz&&n.xyz){let t=n.fromXyz,r=n.to??e.xyz,a=n.xyz;for(let e=0;e<a.length;e++)a[e]=r[e]+(t[e]-r[e])*i;if(n.fromFold&&n.fold&&e.fold?.length===n.fold.length){let t=n.fromFold,r=e.fold;for(let e=0;e<n.fold.length;e++)n.fold[e]=r[e]+(t[e]-r[e])*i}}return n.ax=e.ax+(n.fromAx-e.ax)*i,n.ay=e.ay+(n.fromAy-e.ay)*i,n}shownZ(e,t){return($[e.type].drape?0:e.base)+e.lift-this.setDownBy(e)+this.dropAt(e,t)+(e.lift>0&&e.hover?e.hover.off:0)}hoverAt(e){if(this.stack.bendOf(e)>0)return null;if(!$[e.type].drape)return e.base;let[t,n]=Qw(e,Zw(e).xyz);return t>n?null:(t+n)/2}followHover(e){let t=this.carry&&this.placed.includes(this.carry.p)?this.carry.p:null;if(this.hovering&&this.hovering!==t&&(this.hovering.hover=void 0),this.hovering=t,!t||t.lift<=0||this.stack.bendOf(t)>0)return t&&(t.hover=void 0),!1;let n=this.hoverAt(t);if(n===null)return!1;let r=t.hover??={at:n,off:0};return r.off=nS(r.off,n-r.at,e),r.at=n,r.off!==0}reshow(e,t){e.shown=void 0,this.show(e,t),this.stage.needsRender=!0,this.stage.shadowsChanged()}lean(e,t,n,r){return this.normal.set(-t,-n,1).normalize(),e.setFromUnitVectors(kS,this.normal).multiply(this.turn.setFromAxisAngle(kS,r))}layFoot(e){let t=e.foot;t.position.set(e.x,e.y,0),t.rotation.z=e.rot,t.visible=e.lift===0;let n=$[e.type],r=t.material.uniforms.stand;if(r.value=Math.min(1,n.thick/11/Hf),!t.visible)return;let i=n.drape?ib(e):null,a=n.thick/11,o=t.geometry.getAttribute(`gap`),s=t.geometry.getAttribute(`position`),c=Math.cos(e.rot),l=Math.sin(e.rot),u=!1,d=0,f=0;for(let t=0;t<s.count;t++){let n=s.getX(t),r=s.getY(t),p=e.x+n*c-r*l,m=e.y+n*l+r*c,h=(i?i(p,m)-a:this.stack.undersideAt(e,p,m))-this.opts.surfaceAt(p,m),g=Math.max(0,h);o.setX(t,g),g<BS&&(u=!0),h<0&&(d-=h,f++)}if(o.needsUpdate=!0,t.visible=u,i)return;d=f>0?d/f:0;let p=this.stack.thickOf(e);r.value=Math.min(1,Math.max(0,p-d)/Hf)}queueSettle(e=`all`){this.settleQueued!==`all`&&(this.settleQueued=e),this.stage.needsRender=!0}assetOf(e,t){let n=this.assets.get(e);if(!n)throw Error(`no topping ${e}`);let r=$[e].vary;if(!r||t===void 0)return n;let i=Ax(e,t),a=this.variants.get(i);if(!a){let e=vx(n.img,n.alpha,n.aw,n.ah,n.frame,r,t);a={...n,img:e.img,alpha:e.alpha,shape:void 0,outline:void 0},this.variants.set(i,a)}return a}prepare(e){let t=$[e];if(!t?.vary||!this.assets.has(e)||this.nextVariant.has(e))return;let n=Math.floor(Math.random()*24);this.nextVariant.set(e,n);let r=this.variants.has(Ax(e,n))?null:this.bendWorker();if(!r){mx(()=>this.prebuild(e,n));return}let i=this.assets.get(e),a=i.img,o=a.naturalWidth,s=a.naturalHeight,c=this.photoPixels.get(e);c||this.photoPixels.set(e,c=px(`${e} Pixel`,()=>rf(a,o,s)));let l=c.slice(),u=++this.bendSeq;this.bending.set(u,{type:e,v:n});let d={seq:u,from:l,W:o,H:s,alpha:i.alpha,aw:i.aw,ah:i.ah,frame:i.frame,vary:t.vary,v:n};r.postMessage(d,[l.buffer])}bendWorker(){if(this.bender!==void 0)return this.bender;try{let e=new Worker(new URL(`./bend.worker-BOM_ON_F.js`,import.meta.url),{type:`module`});e.onmessage=e=>this.bent(e.data),e.onerror=()=>{e.terminate(),this.bender=null;let t=[...this.bending.values()];this.bending.clear();for(let{type:e,v:n}of t)mx(()=>this.prebuild(e,n))},this.bender=e}catch{this.bender=null}return this.bender}bent(e){let t=this.bending.get(e.seq);if(!t)return;this.bending.delete(e.seq);let{type:n,v:r}=t,i=Ax(n,r);if(!this.variants.has(i)){let t=this.assets.get(n),r=t.img,a=px(`${n} gebogen`,()=>yx(e.pixels,r.naturalWidth,r.naturalHeight));this.variants.set(i,{...t,img:a,alpha:e.alpha,shape:void 0,outline:void 0})}this.nextVariant.get(n)===r&&mx(()=>this.prebuild(n,r))}prebuild(e,t){if(this.nextVariant.get(e)!==t)return;let n=this.variants.has(Ax(e,t))?this.assetOf(e,t):px(`${e} biegen`,()=>this.assetOf(e,t));px(`${e} Umriss`,()=>this.outlineOf(n)),mx(()=>{this.nextVariant.get(e)===t&&px(`${e} Körper`,()=>{let{w:t,h:r,cx:i,cy:a}=this.stack.frameOf(e,n);$[e].shape?this.shapedGeometry(e,n,t,r,i,a):this.discGeometry(e,n,t,r,i,a)})})}takeVariant(e){if(!$[e].vary)return;let t=this.nextVariant.get(e)??Math.floor(Math.random()*24);return this.nextVariant.delete(e),this.prepare(e),t}footprint(e,t,n,r,i){let a=this.assetOf(e,i),o={...this.stack.frameOf(e,a),type:e,x:t,y:n,rot:r},s=this.stack.cellsUnder(o),c=this.stack.frameToWorld(o,o.comX,o.comY);return $[e].shape?(this.shapeOf(e,a,o.w,o.h),{cells:s,com:c,bot:this.stack.shapeCells(o,s,`bot`),top:()=>this.stack.shapeCells(o,s,`top`)}):{cells:s,com:c}}add(e,t,n,r,i){this.landLetGo();let a=this.build(e,t,n,r,i);this.stage.scene.add(a.mesh),this.stage.contactScene.add(a.foot),this.stack.push(a),this.layTop(a),this.select(a),this.settle(),this.opts.onChange?.()}restore(e,t=!1,n=null){this.letGone=null;let r=[];n&&C_(Math.max(0,...n)),n&&(this.keptLaid=new Promise(e=>this.sayKeptLaid=e)),e.forEach((e,t)=>{if(!this.assets.has(e.type))return;let i=this.piece(e.type,e.x,e.y,e.rot,e.v);n&&(i.id=n[t]),this.stack.push(i),r.push(i)}),this.sampleSpread(this.stack.spread),this.stack.layLevel();let i=r[r.length-1];this.loadNext=!0,this.settle(null,t&&i?e=>this.slideToRest(i,!1,()=>{},e.topSlide):void 0,t&&!!i),this.loadNext=!1;for(let e of r)this.dress(e),this.stage.scene.add(e.mesh),this.stage.contactScene.add(e.foot);let a=performance.now();for(let e of this.placed)this.show(e,a)}silhouette(){let e=[];for(let t of this.placed){let n=t.asset,r=$[t.type],i=r.drape?r.thick/11:this.stack.thickOf(t),a=(e,t)=>e>=0&&t>=0&&e<n.aw&&t<n.ah&&n.alpha[t*n.aw+e]>=128,o=r.drape?ib(t):null;for(let r=0;r<n.ah;r+=4)for(let s=0;s<n.aw;s+=4){if(!a(s,r)||a(s-4,r)&&a(s+4,r)&&a(s,r-4)&&a(s,r+4))continue;let[c,l]=this.stack.frameToWorld(t,(s+.5)/n.aw,(r+.5)/n.ah),u=o?o(c,l)+t.lift:this.stack.undersideAt(t,c,l)+i;e.push(new Z(c,l,u),new Z(c,l,u-i))}}return e}turnAt(e,t,n){this.landLetGo();let r=this.hitTest(e,t);return r?(this.heldDown(r,!r.shake)||(this.opts.onTurn?.(),r.rot+=n,this.queueSettle(this.placed[this.placed.length-1]===r?`top`:`all`),clearTimeout(this.turnEnd),this.turnEnd=window.setTimeout(()=>{this.settle(this.slidingTop(),()=>this.slideToRest(r,!0,()=>{})),this.opts.onChange?.()},250)),!0):!1}remove(e,t=!0){this.takeOff(e),this.dispose(e),this.selected===e&&this.select(null),t&&this.settle(),this.opts.onChange?.()}dispose(e){this.stack.put===e&&(this.stack.put=null),this.dropGeometry(e);for(let t of[e.mesh.material].flat())t.dispose();e.mesh.customDepthMaterial?.dispose(),e.rim?.customDepthMaterial?.dispose(),e.foot.material.dispose();for(let t of Yw(e))t.dispose()}select(e){e!==this.selected&&(this.handleSide=0),this.selected=e,this.placeHandle()}deselect(){this.select(null)}placeHandle(){let e=this.selected;if(!e){this.handle.style.display=`none`;return}let t=this.stack.topOf(e),n=n=>{let r=e.rot+n*Math.PI/2,i=n%2?e.halfObjH:e.halfObjW;return this.stage.toScreen(new Z(e.x+Math.cos(r)*i,e.y+Math.sin(r)*i,t))},r=this.host.getBoundingClientRect(),i=0,a=0;if(this.turning)[i,a]=n(this.handleSide);else{let e=this.opts.handleRoom?.(r)??r,t={left:e.left+CS,top:e.top+CS,right:e.right-CS,bottom:e.bottom-CS},o=TS([0,1,2,3].map(n),t,this.handleSide);this.handleSide=o.side,i=o.x,a=o.y}this.handle.style.display=`block`,this.handle.style.left=`${i-r.left}px`,this.handle.style.top=`${a-r.top}px`}bindHandle(){this.handle.addEventListener(`pointerdown`,e=>{this.landLetGo();let t=this.selected;if(!t||(e.stopPropagation(),e.preventDefault(),this.heldDown(t)))return;this.opts.onTurn?.();let n=e.pointerId,[r,i]=this.stage.toScreen(new Z(t.x,t.y,this.stack.topOf(t))),a=Math.atan2(e.clientY-i,e.clientX-r),o=t.rot;this.turning=!0,this.handle.setPointerCapture(n);let s=e=>{e.pointerId===n&&(t.rot=o-(Math.atan2(e.clientY-i,e.clientX-r)-a),this.queueSettle(`top`),e.preventDefault())},c=e=>{e.pointerId===n&&(this.handle.removeEventListener(`pointermove`,s),this.handle.removeEventListener(`pointerup`,c),this.handle.removeEventListener(`pointercancel`,c),this.turning=!1,this.settle(this.slidingTop(),()=>this.slideToRest(t,!0,()=>{})),this.opts.onChange?.())};this.handle.addEventListener(`pointermove`,s),this.handle.addEventListener(`pointerup`,c),this.handle.addEventListener(`pointercancel`,c)})}hitTest(e,t,n=new Z,r=!1,i=null){let a=r?0:22/this.stage.pxPerUnit,o=this.hitAt,s=null,c=1/0;for(let r=this.placed.length-1;r>=0;r--){let l=this.placed[r];if(l===i||!this.stage.pointOnPlane(e,t,this.stack.topOf(l),o,l))continue;if(this.coversTilted(l,o))return n.copy(o),l;if(Math.min(l.halfObjW,l.halfObjH)>=a)continue;let[u,d]=U_(l.ax,l.ay,l.rot,o.x-l.x,o.y-l.y,o.z-l.base-l.lift);if(Math.abs(u)>Math.max(l.halfObjW,a)||Math.abs(d)>Math.max(l.halfObjH,a))continue;let f=Math.hypot(u,d);f<c&&(c=f,s=l,n.copy(o))}return s}pointAt(e,t){let n=new Z;return this.hitTest(e,t,n)?n:this.stage.pointOnPlane(e,t,zf,n)?this.opts.onBread(n.x,n.y)?n.setZ(this.opts.surfaceAt(n.x,n.y)):this.stage.pointOnPlane(e,t,0,n):null}heldDown(e,t=!0){let n=this.coveredBy(e);return n.length!==0&&(this.selected===e&&this.select(null),t&&this.wiggle([e,...n]),!0)}wiggle(e){let t=performance.now();for(let n of e)n.shake=t;this.stage.needsRender=!0}endSlide(e){e.slide=null,this.goingTo.delete(e),this.sliding===e&&(this.sliding=null),e.ease&&(e.ease.to=null,e.ease.at=void 0)}coveredBy(e){let t=this.placed.slice(this.placed.indexOf(e)+1);if(t.length===0)return[];let n=this.heightReader(e,!1),r=t.map(e=>this.heightReader(e,!0)),i=(e,i,a)=>this.stack.covers(t[e],i,a)&&r[e](i,a)>=n(i,a),a=e.asset,o=[],s=0;for(let n=0;n<a.ah;n+=4)for(let r=0;r<a.aw;r+=4){if(a.alpha[n*a.aw+r]<128)continue;let c=this.stack.frameToWorld(e,(r+.5)/a.aw,(n+.5)/a.ah);o.push(c),t.some((e,t)=>i(t,c[0],c[1]))&&s++}return o.length===0||s/o.length<=AS?[]:t.filter((e,t)=>o.some(([e,n])=>i(t,e,n)))}heightReader(e,t){let n=$[e.type];if(n.drape){let r=ib(e),i=0;if(!t){i=n.thick/11;let t=0;if(e.fold)for(let n=2;n<e.fold.length;n+=3)t=Math.max(t,e.fold[n]);i+=t}return(e,t)=>r(e,t)-i}let r=t?this.stack.thickOf(e):0;return(t,n)=>this.stack.undersideAt(e,t,n)+r}warm(e){this.warmed.has(e.type)||(this.warmed.add(e.type),this.compileLooks(e).catch(()=>{}))}compileLooks(e){let t=this.stage.compileAhead(e.mesh,e.foot);this.paleLook(e,!0);let n=this.stage.compileAhead(e.mesh,e.foot);return this.paleLook(e,!1),Promise.all([t,n]).then(([e])=>e)}async warmUp(e){if(this.warmMaterials.has(e)||!this.assets.has(e))return;let t=$[e].vary,n=this.build(e,0,0,0,t?this.nextVariant.get(e)??0:void 0);this.warmed.add(e),this.warmMaterials.set(e,[n.mesh.material,n.mesh.customDepthMaterial??[],...Yw(n),n.rim?.customDepthMaterial??[],n.foot.material].flat()),n.mesh.position.set(0,0,zf+MS),n.foot.position.copy(n.mesh.position),n.foot.visible=!0;let r=this.stage,i=await this.compileLooks(n);px(`${e} Shader`,()=>{r.scene.add(n.mesh),r.contactScene.add(n.foot);for(let e of i?[!1]:[!1,!0])this.paleLook(n,e),r.shadowsChanged(),r.render();this.paleLook(n,!1),r.scene.remove(n.mesh),r.contactScene.remove(n.foot),r.shadowsChanged(),this.dropGeometry(n)})}knifeAt(e,t){this.landLetGo();let n=this.stage.pointOnPlane(e,t,zf,this.knifeHit);if(!n)return this.met?`on`:`off`;this.shove&&this.shoveTo(this.shove,e,t,n.x,n.y);let r=this.hitTest(e,t,void 0,!0,this.shove?.p??null),i=this.met;if(!r)return this.met=null,`off`;if(i?.p!==r)return this.met={p:r,x:n.x,y:n.y,edge:i===null},this.knock(r),`on`;let a=n.x-i.x,o=n.y-i.y,s=Math.hypot(a,o);if(s<$C)return`on`;if(!this.beginShove(r,e,t,n.x,n.y,a/s,o/s))return i.x=n.x,i.y=n.y,`on`;let c=this.hitTest(e,t,void 0,!0,r);return this.met=c?{p:c,x:n.x,y:n.y,edge:!1}:null,c?`on`:i.edge?`gave`:`off`}knifeUp(){this.met=null,this.endShove()}knock(e){this.wiggle([e,...this.coveredBy(e)])}beginShove(e,t,n,r,i,a,o){if(this.dragging||this.sliding!==null&&this.sliding!==e&&this.sliding!==this.shove?.p||this.heldDown(e))return!1;this.endShove(),e.slide&&this.endSlide(e),this.down=this.down.filter(t=>t.p!==e),this.goingTo.delete(e);let s=this.stack.laidTop(e);this.stack.toTop(e),e.slid=0,this.sliding=e;let c={p:e,toX:e.x,toY:e.y,owedX:0,owedY:0,dx:a,dy:o,kx:r,ky:i};return this.shove=c,this.shoveTo(c,t,n,r,i),c.owedX=c.toX-e.x,c.owedY=c.toY-e.y,this.queueSettle(s?`top`:`all`),this.opts.onTopping?.(`give`),!0}shoveTo(e,t,n,r,i){let a=e.p,o=r-e.kx,s=i-e.ky,c=Math.hypot(o,s);c>=tw&&(e.dx=o/c,e.dy=s/c,e.kx=r,e.ky=i);let l=e.toX-a.x,u=e.toY-a.y,d=this.stage.pointOnPlane(t,n,this.stack.topOf(a),this.hitAt,{x:e.toX,y:e.toY,ax:a.ax,ay:a.ay});if(!d)return;let f=rw((e,t)=>this.stack.coversOnPlane(a,e,t,a.ax,a.ay),d.x-l,d.y-u,e.dx,e.dy,nw,2*Math.hypot(a.halfObjW,a.halfObjH));e.toX+=e.dx*f,e.toY+=e.dy*f}shoveStep(e,t){let n=this.shove;if(!n)return;if(n.p!==this.placed[this.placed.length-1]){this.endShove();return}let r=QC(t,ew);n.owedX=Math.abs(n.owedX)<nw?0:n.owedX*(1-r),n.owedY=Math.abs(n.owedY)<nw?0:n.owedY*(1-r),this.shoveLay(n,n.toX-n.owedX,n.toY-n.owedY,e)}shoveLay(e,t,n,r,i=!1){let a=e.p;return t===a.x&&n===a.y||(a.x=t,a.y=n,this.stage.needsRender=!0,this.stage.shadowsChanged(),this.opts.onBread(t,n)?(this.stack.laidTop(a)?i||this.queueSettle(`top`):(this.show(a,r),this.queueSettle(`all`)),!0):(this.shove=null,this.sliding=null,this.opts.onTopping?.(`remove`),this.fallOff(a,e.dx,e.dy),this.settleGone(),!1))}endShove(){let e=this.shove;if(!e)return;let t=e.p,n=t===this.placed[this.placed.length-1];(!n||this.shoveLay(e,e.toX,e.toY,performance.now(),!0))&&(this.shove=null,this.sliding===t&&(this.sliding=null),this.placed.includes(t)&&(n?this.putDown(t,null,!0):this.settle()))}beginDrag(e,t){if(this.landLetGo(),this.dragging||this.heldDown(e))return;this.sliding===e&&this.endSlide(e);let n=this.selected===e,r=this.stack.laidTop(e);this.warm(e),this.stack.toTop(e),this.select(e);let i=t.pointerId,a=t.clientX,o=t.clientY,s=this.stage.pointOnPlane(t.clientX,t.clientY,this.stack.topOf(e),void 0,e),c=s?e.x-s.x:0,l=s?e.y-s.y:0,u=!1,d=t=>{if(t.pointerId===i&&!(!u&&Math.hypot(t.clientX-a,t.clientY-o)<OS)){if(this.queueSettle(u||r?`top`:`all`),!u){this.opts.onTopping?.(`lift`),e.slid=0;let t=this.hoverAt(e);e.hover=t===null?void 0:{at:t,off:0},e.lift=jS,e.drop={from:-.05,start:performance.now()},this.startCarry(e,c,l,this.heldZ(e,e.x-c,e.y-l))}u=!0,this.carryTo(t.clientX,t.clientY),e.gone=this.lostCarried(e),t.preventDefault()}},f=t=>{if(t.pointerId!==i)return;window.removeEventListener(`pointermove`,d),window.removeEventListener(`pointerup`,f),window.removeEventListener(`pointercancel`,f),this.drags--;let r=u&&this.lostCarried(e);if(this.carry=null,e.gone=!1,r){this.opts.onTopping?.(`remove`),this.dropOff(e),this.settleGone();return}if(u&&this.letGo(e))return;let a=u?this.drawnNow(e,performance.now()):null;e.lift=0,u?(e.drop=void 0,this.putDown(e,a)):(n&&this.select(null),this.settle())};this.drags++,window.addEventListener(`pointermove`,d),window.addEventListener(`pointerup`,f),window.addEventListener(`pointercancel`,f)}dragFromStock(e,t,n,r,i){if(!this.assets.get(e)||this.dragging)return;this.landLetGo(),this.opts.onTopping?.(`lift`);let a=this.build(e,0,0,(Math.random()-.5)*.4,this.takeVariant(e));a.lift=MS,this.select(null);for(let e of[a.mesh.material].flat()){let t=e.map;t&&this.stage.renderer.initTexture(t)}this.warm(a);let o=this.stage.pxPerUnit,s=document.createElement(`div`);s.className=`topping floating`,s.style.width=`${a.w*o}px`,s.style.height=`${a.h*o}px`;let c=document.createElement(`div`);c.className=`turned`,c.style.transformOrigin=`${a.cx*100}% ${a.cy*100}%`,c.style.transform=`rotate(${-a.rot}rad)`,s.appendChild(c);for(let[t,n]of[[`tool-shadow`,l_(`top-${e}`,`-shadow`)],[`tool-img`,l_(`top-${e}`)]]){let e=document.createElement(`img`);e.className=t,e.src=n,e.alt=``,e.draggable=!1,t===`tool-shadow`&&(e.style.transform=`translate(${a.w*o*.036}px, ${a.w*o*.048}px)`),c.appendChild(e)}this.host.appendChild(s);let l=!1,u=(e,t)=>{s.style.left=`${e-a.cx*a.w*o}px`,s.style.top=`${t-a.cy*a.h*o}px`},d=(e,t)=>{let n=t<i+(l?IS:0);if(n&&!this.carry&&this.startCarry(a,0,0,zf+MS),n&&this.carryTo(e,t)){l?this.queueSettle(`top`):(this.stage.scene.add(a.mesh),this.stage.contactScene.add(a.foot),this.carryOnTop(a),l=!0),a.gone=this.lostCarried(a);let n=i-(t-a.cy*a.h*o);n<a.h*o*1.5?(u(e,t),s.style.clipPath=`polygon(-100% ${n}px, 200% ${n}px, 200% 300%, -100% 300%)`,s.style.display=`block`):s.style.display=`none`}else this.carry=null,l&&=(this.takeOff(a),!1),s.style.clipPath=``,s.style.opacity=``,s.style.display=`block`,u(e,t)};d(n,r);let f=e=>{e.pointerId===t&&(d(e.clientX,e.clientY),e.preventDefault())},p=e=>{if(e.pointerId!==t)return;window.removeEventListener(`pointermove`,f),window.removeEventListener(`pointerup`,p),window.removeEventListener(`pointercancel`,p),this.drags--;let n=l&&this.lostCarried(a);if(this.carry=null,s.remove(),!l){this.dispose(a);return}if(a.gone=!1,e.type===`pointercancel`){a.lift=0,this.remove(a,!1);return}if(n){this.dropOff(a);return}if(this.letGo(a)){this.select(a);return}let r=this.drawnNow(a,performance.now());a.lift=0,this.select(a),this.putDown(a,r)};this.drags++,window.addEventListener(`pointermove`,f),window.addEventListener(`pointerup`,p),window.addEventListener(`pointercancel`,p)}putFromStock(e){if(!this.assets.get(e)||this.dragging)return!1;let t=performance.now(),n=this.taps.length+ +!!this.tapping;return this.taps.length>=fS||!_S(n,this.tapEach,t-this.tapNext)?!1:(n===0&&(this.tapNext=t),this.tappedAt=t,this.taps.push(e),this.stage.needsRender=!0,!0)}dropTaps(){this.taps=[];let e=this.endTap();e&&this.dispose(e)}endTap(){let e=this.tapping;return e?(e.asked&&this.probing?.seq===e.asked.seq&&(this.probing=null),this.tapping=null,e.p):null}get tapReady(){return this.dragging||this.carry||this.letGone||this.settleQueued!==null||this.settleAfter>0||this.sliding&&!this.avoid?.ids.has(this.sliding.id)||this.avoid?.wait||this.pending&&!this.pending.fine&&!this.supportHeld||!this.down.every(e=>e.early?.calm)?!1:!this.placed.some(e=>e.drop?.fall&&!this.down.some(t=>t.p===e))}get supportHeld(){return this.stack.settled||this.heldKey!==null&&this.weighing()===this.heldKey}weighing(){let e=``;for(let t of this.stack.pieces){if(t.lift!==0)continue;let n=this.goingTo.get(t);(!n||this.endsOnBread(n[0],n[1]))&&(e+=`${t.id} ${n?n[0]:t.x} ${n?n[1]:t.y} ${t.rot}|`)}return e}avoidSlide(e,t){let n=this.avoid??={cells:new Uint8Array(16384),ids:new Set,wait:!1};n.ids.add(e.id);let r=Math.ceil(Math.hypot(t[0]-e.x,t[1]-e.y)*128/2)+1;for(let i=0;i<=r;i++){let a=i/r;for(let r of this.stack.cellsUnder({...e,x:e.x+(t[0]-e.x)*a,y:e.y+(t[1]-e.y)*a})){let e=r%128,t=Math.floor(r/128);for(let r=Math.max(0,t-1);r<=Math.min(127,t+1);r++)for(let t=Math.max(0,e-1);t<=Math.min(127,e+1);t++)n.cells[r*128+t]=1}}this.heldKey=this.weighing()}nextTap(){let e=this.tapping;e?this.tapReady?this.seekTap():(this.endTap(),this.dispose(e.p),this.taps.unshift(e.p.type)):this.avoid?.wait&&!this.pending&&!this.dropped&&!this.probing&&!this.sliding&&this.down.length===0&&this.settleQueued===null&&this.settleAfter===0?this.settle():this.taps.length!==0&&this.tapReady&&(!this.supportHeld&&!this.tapSettled?(this.tapSettled=!0,this.settle()):(this.tapSettled=!1,this.putTapped(this.taps.shift())))}putTapped(e){if(!this.assets.get(e))return;let t=this.build(e,0,0,(Math.random()-.5)*.4,this.takeVariant(e));t.tapped=!0,this.stack.put=t;let n=this.stack.bendOf(t)===0,r=this.calmSpots(t),i=r.length===0&&!this.avoid;i&&(r=this.calmSpots(t,!0));let a=n?Ox(r,mS):[];n&&(r=[...a,...r.filter(e=>!a.includes(e))]),r.length===0?(this.dispose(t),this.tapNext=performance.now(),this.avoid&&(this.avoid.wait=!0,this.taps.unshift(e))):(this.tapping={p:t,spots:r,next:0,slid:[],least:1/0,at:r[0],found:i,asked:null,lie:null,stays:!1,slide:null,onPage:!1,...n?{want:pS,lead:a.length}:{}},this.seekTap())}seekTap(){let e=this.tapping;if(!e)return;let{p:t}=e,n=this.supportHeld;n&&!this.stack.settled&&this.stack.foldAlone();let r=e.found||!(n&&this.settleQueued===null);if(!r&&this.tapOnThread(e)?r=this.askTap(e):r||(this.stack.push(t),this.stack.carryOn(t),e.lie=null,e.stays=!1,e.slide=null,r=kx(this.stack,t,e,oS,sS,performance.now()+cS),this.stack.takeOff(t)),!r)return;this.endTap();let i=performance.now();this.tapEach=i-this.tapNext,this.tapNext=i,[t.x,t.y]=e.at,this.opts.onTopping?.(`lift`),this.warm(t),this.stage.scene.add(t.mesh),this.stage.contactScene.add(t.foot);let a=e.lie,o=this.stack.bendOf(t)>0,s=!!a&&(a.xyz?a.xyz.length===t.xyz.length:!o)&&n&&this.settleQueued===null;s&&o?(this.stack.push(t),this.stack.carryOn(t),t.lift=MS,this.stack.settleTop(),t.lift=0,t.foresight=this.foreseen(a,t,null,performance.now())):s?(this.stack.push(t),this.stack.carryOn(t),Rx(this.stack,t,a,new Map(this.placed.map(e=>[e.id,e]))),t.lie=void 0,t.shown=void 0,this.stage.shadowsChanged()):this.carryOnTop(t);let c=performance.now(),l=this.down.map(e=>e.p.drop?.fall?e.p.drop.start+(e.p.drop.ms??340):0);t.drop={from:rS,start:c,fall:!0,ms:Math.max(l.length>0||this.taps.length>0?iS:340,...l.map(e=>e-c))},this.tappedAt=c,this.select(t),this.putDown(t,null,!1,s&&!o);let u=this.down[this.down.length-1];s&&e.stays&&u?.p===t&&!u.away?(this.heldKey=this.weighing(),this.stack.laidAlone=t,this.settleEarly(u,!0)):s&&e.slide&&n&&u?.p===t&&!u.away&&(u.early={calm:!0,slide:e.slide},this.goingTo.set(t,e.slide.to),this.avoidSlide(t,e.slide.to))}tapOnThread(e){return!e.onPage&&!(this.settler instanceof Hx)}askTap(e){let{p:t}=e,n=this.stack.bendOf(t)>0;if(e.asked&&this.probing?.seq===e.asked.seq)return!1;e.asked=null;let r=e.spots[0];this.putOff();let i=this.request(null,!0),a=Ax(t.type,t.v),o=!this.sentAssets.has(a);return o&&(this.sentAssets.add(a),i.assets[a]=oT(t.asset)),i.pieces.push({id:t.id,type:t.type,v:t.v,x:r[0],y:r[1],rot:t.rot,lift:0,ver:void 0}),i.seek={spots:e.spots,checks:n?lS:oS,apart:sS,ms:uS,grids:this.stack.grids,...this.avoid?{moved:[...this.avoid.ids]}:{},...e.want?{want:e.want,lead:e.lead}:{}},this.probing={seq:i.seq,p:t,at:performance.now()},e.asked={seq:i.seq},this.closeOpenSlide(),this.settler.settle(i,e=>this.tapProbed(e),t=>{this.threadError=t??`gone`,this.probing?.seq===i.seq&&(this.probing=null),o&&this.sentAssets.delete(a),e.asked=null,e.lie=null,e.onPage=!0}),!1}tapProbed(e){this.probing?.seq===e.seq&&(this.probing=null);let t=this.tapping;if(!t?.asked||e.seq!==t.asked.seq)return;t.asked=null,this.stage.needsRender=!0;let n=e.pieces.find(e=>e.id===t.p.id)??null;e.seek&&n?(t.at=e.seek.at,t.lie=n,t.found=!0,t.stays=!e.slips,t.slide=e.topSlide??null):t.onPage=!0}calmSpots(e,t=!1){let n=this.breadCells(),r=[],i=0,a=0;for(let e=0;e<n.length;e++)n[e]&&(r.push(e),i+=u_(e%128),a+=d_(Math.floor(e/128)));if(r.length===0)return[];i/=r.length,a/=r.length;let o=Float32Array.from(this.stack.grids.sup);for(let e of this.placed){let t=this.stack.topOf(e)-e.lift;for(let n of this.stack.cellsUnder(e))o[n]=Math.max(o[n],t)}let s=yS(e),c=[];for(let l=0;l<aS;l++){let u=r[Math.floor(Math.random()*r.length)],d=l===0?[i,a]:[u_(u%128),d_(Math.floor(u/128))],f={...e,x:d[0],y:d[1]},p=l>0?bS(s,u%128,Math.floor(u/128)):this.stack.cellsUnder(f),m=!this.avoid||!p.some(e=>this.avoid.cells[e]);if(!t&&gS(p,o,n)-zf>=25/11)continue;let h=m&&this.opts.onBread(...this.stack.frameToWorld(f,f.comX,f.comY))?vS(p,o,n,Math.hypot(d[0]-i,d[1]-a)):1/0;Number.isFinite(h)&&c.push({at:d,cost:h})}return c.sort((e,t)=>e.cost-t.cost).map(e=>e.at)}letGo(e){if(this.settler instanceof Hx||!$[e.type].drape||e.lift===0||this.foreseenHere(e))return!1;if(!this.threadShapes(e)||this.pending?.held)return e.foresight=null,!1;let t=e.probedAt;this.probing?.p===e&&t&&OC(e,t,vC,mC/10)||this.probe(e,performance.now());let n=this.probing;return!n||n.p!==e?(e.foresight=null,!1):(this.letGone={p:e,seq:n.seq},this.stage.needsRender=!0,!0)}foreseenHere(e){let t=e.foresight;return!!t?.xyz&&t.xyz.length===e.xyz.length&&OC(e,t,pC,mC)}landLetGo(){let e=this.letGone;if(!e)return;this.letGone=null;let t=e.p;if(!this.placed.includes(t)||t.lift===0)return;let n=this.drawnNow(t,performance.now());this.foreseenHere(t)||(t.foresight=null),t.lift=0,t.drop=void 0,this.putDown(t,n)}putDown(e,t=null,n=!1,r=!1){let i=r;r?this.show(e,performance.now()):this.stack.gridsBelowOf===e&&(this.layForeseen(e)?i=!0:this.settleTop()),i&&this.settleQueued===`top`&&(this.settleQueued=null);let a=performance.now();e.unrock=e.rocked?{dir:e.rocked.dir,from:e.rocked.angle,start:a,size:e.rockVec?Math.min(1,Math.hypot(e.rockVec[0],e.rockVec[1])):1}:void 0,e.rockVec=void 0,t&&this.startEase(e,t,a),!n&&e.slid===0&&(this.stack.put=e);let o=(e.slid===0?e.foresight:null)?.slips??null;o?(this.settleQueued===`top`&&(this.settleQueued=null),this.down.push({p:e,frames:1,away:o})):this.down.push({p:e,frames:2,...n?{shoved:n}:{}})}tapLanded(e,t){e.tapped&&(e.tapped=!1,t||this.opts.onTapLanded?.(e.type))}layForeseen(e){let t=e.foresight;return this.settler instanceof Hx?!1:this.stack.bendOf(e)===0?this.lieForeseen(e):!t?.xyz||t.xyz.length!==e.xyz.length?!1:(e.xyz.set(t.xyz),e.shift=t.shift?.slice()??null,t.fold&&e.fold?.length===t.fold.length&&e.fold.set(t.fold),e.ver++,e.shown=void 0,this.show(e,performance.now()),this.stage.needsRender=!0,this.stage.shadowsChanged(),!0)}lieForeseen(e){let t=e.foresight;if(!t||!OC(e,t,pC,mC))return!1;let n=t.lie;return n.same||(n.xyz?n.xyz.length!==e.xyz.length:$[e.type].drape)?!1:(this.takeLie(e,{...n,xyz:n.xyz?.slice()??null,fold:n.fold?.slice()??null,shift:n.shift?.slice()??null}),this.show(e,performance.now()),this.stage.needsRender=!0,!0)}takeLie(e,t){Rx(this.stack,e,t,new Map(this.placed.map(e=>[e.id,e]))),e.lie=void 0,e.shown=void 0,this.stack.laidAlone=e,this.stage.shadowsChanged(),this.placeHandle()}slipAway(e,t){return this.stack.laidTop(e)?(this.slideOpen(e,t,t=>{this.endsOnBread(t[0],t[1])?this.cuePlace(e):this.opts.onTopping?.(`remove`),this.opts.onChange?.()}),!0):!1}cuePlace(e){this.comingDown(e)?this.placeCues.includes(e)||this.placeCues.push(e):this.opts.onTopping?.(`place`)}comingDown(e,t=!1){if(this.sliding===e||e.drop?.high||e.drop?.fall)return!0;let n=e.ease?.xyz;return!!n&&Qw(e,n)[1]-Qw(e,e.xyz)[1]>(t?qx:Kx)}placeCuesDue(){this.placeCues.length!==0&&(this.placeCues=this.placeCues.filter(e=>!this.placed.includes(e)||e.lift>0?!1:this.comingDown(e,!0)?!0:(this.opts.onTopping?.(`place`),!1)))}settleDown(){if(this.down.length===0)return;let e=e=>!!e.p.drop?.fall&&this.placed.includes(e.p),t=t=>t.frames<=0&&!e(t);for(let e of this.down)e.frames--;for(let t of this.down)t.frames<=0&&!t.early&&!t.away&&e(t)&&this.settleEarly(t);let n=this.down.filter(t);if(n.length===0)return;this.down=this.down.filter(e=>!t(e));for(let e of n){let t=e.early?.slide;t&&(this.sliding||!this.placed.includes(e.p)||e.p.lift>0?(e.early=void 0,this.goingTo.delete(e.p)):(this.setSliding(e.p,t.to,t.path,this.stack.laidTop(e.p)?t.land??null:null,this.stack.laidTop(e.p)?t.steps??null:null),this.tapLanded(e.p,!this.endsOnBread(t.to[0],t.to[1])),this.endsOnBread(t.to[0],t.to[1])?this.cuePlace(e.p):this.opts.onTopping?.(`remove`),this.opts.onChange?.()))}if(n=n.filter(e=>!e.early?.slide),n.length===0)return;let r=n.filter(e=>this.placed.includes(e.p)&&e.p.lift===0&&!(e.away&&this.slipAway(e.p,e.away))).map(e=>e.p);if(r.length===0)return;let i=new Set(n.filter(e=>e.shoved).map(e=>e.p)),a=(e,t)=>{this.tapLanded(e,t),!t&&e.slid===0&&!i.has(e)?this.cuePlace(e):(t||e.slid===0)&&this.opts.onTopping?.(t?`remove`:`stay`)},o=r.length===1&&!n.find(e=>e.p===r[0])?.early&&this.slidesOn(r[0])&&this.stack.laidTop(r[0])&&this.stack.weighKey(r[0])===this.stack.lastStack?r[0]:null;if(o&&this.slipDir(o))this.slideToRest(o,!1,e=>a(o,e));else{for(let e of r)a(e,!1);let e=e=>{for(let t of r)this.slidesOn(t)&&this.slideToRest(t,!1,e=>e&&a(t,!0),e?.topSlide)},t=this.placed[this.placed.length-1],i=r.length===1?n.find(e=>e.p===r[0])?.early:void 0,o=i?.key!==void 0&&i.key===this.sceneKey(null);if(i?.key!==void 0&&(o||t!==r[0])){let t=o?i.res:void 0;e(t),t?.slip&&this.slideUnder(t.slip.id,t.slip.to,t.slip.path)}else i&&i.key===void 0&&(this.pending||this.dropped)?this.afterSettle.push({then:e,slideTop:!1}):this.stack.settled?e():this.settle(this.shove?.p??null,e,!!t&&r.includes(t)&&this.slidesOn(t))}this.opts.onChange?.()}settleEarly(e,t=!1){let n=e.early=t?{calm:!0}:{},{p:r}=e,i=t=>{if(!this.down.includes(e))return;t&&(n.res=t),n.key=this.sceneKey(null);let i=this.slidesOn(r)&&this.stack.laidTop(r)&&this.stack.slideDir(r)!==null;n.calm=!t?.slip&&!t?.topSlide&&!i},a=this.placed[this.placed.length-1]===r&&this.slidesOn(r);this.stack.settled?i():this.sliding&&this.sliding!==r?this.afterSettle.push({then:i,slideTop:a}):this.settle(this.shove?.p??null,i,a)}slidesOn(e){return US(e.slid,!!this.stack.tipping(e))}lost(e,t=e.x,n=e.y){if(this.opts.onBread(t,n))return!1;if(Math.abs(t)>.5||Math.abs(n)>.5)return!0;let r=Hb(e),i=this.placed.filter(i=>i!==e&&i.lift===0&&Math.hypot(i.x-t,i.y-n)<=r+Hb(i));if(i.length===0)return!0;let a=t===e.x&&n===e.y?e:Object.assign(this.lostPose,{x:t,y:n,rot:e.rot,w:e.w,h:e.h,cx:e.cx,cy:e.cy,asset:e.asset}),o=new Set(this.stack.cellsUnder(a));return!i.some(e=>this.stack.cellsUnder(e).some(e=>o.has(e)))}lostCarried(e){let t=this.carry;if(!t||t.p!==e||e.lift<=0||Number.isNaN(t.aimed)||!this.stage.rayOnPlane(this.levelZ(e),this.levelHit,void 0,t.ray))return this.lost(e);let n=this.levelHit.x+t.offX,r=this.levelHit.y+t.offY,i=Math.hypot(n,r)||1,a=t=>this.lost(e,n+n/i*t,r+r/i*t),o=a(0);return o===!!e.gone||a(o?-bC:bC)===o?o:!!e.gone}levelZ(e){if(!$[e.type].drape)return e.base+$[e.type].thick/11+e.lift;let t=this.carry;return((this.stack.bendOf(e)===0?e.levelTop:void 0)??e.foresight?.hoverTop??ib(e)(e.x-(t?.offX??0),e.y-(t?.offY??0)))+e.lift}offStulle(e){return!this.opts.onBread(e.x,e.y)&&!this.placed.some(t=>t!==e&&t.lift===0&&this.stack.coversOnPlane(t,e.x,e.y,t.ax,t.ay))}slipDir(e){return this.stack.slideDir(e)??(this.offStulle(e)?this.outward(e):null)}outward(e){let t=Math.hypot(e.x,e.y);return t>1e-6?[e.x/t,e.y/t]:[1,0]}dropOff(e){let t=$[e.type].drape,n=this.shownZ(e,performance.now())-(t?0:e.base);if(e.hover=void 0,e.lift=0,e.drop=void 0,e.gone=!1,t){for(let t of e.ease?.xyz?[e.xyz,e.ease.xyz]:[e.xyz])for(let e=2;e<t.length;e+=3)t[e]+=n;e.ver++}else e.base+=n;e.foresight=null;let[r,i]=this.outward(e);this.fallOff(e,r,i)}paleLook(e,t){this.fade(e,t?FS:1)}fade(e,t){let n=t<1;for(let r of[e.mesh.material,...Yw(e)].flat()){let e=r.userData.alphaTest??=r.alphaTest;r.alphaTest=n?e*Math.max(.05,t):e;let i=r.userData.alphaToCoverage??=r.alphaToCoverage;r.alphaToCoverage=!n&&i,r.transparent=n,r.opacity=t,r.depthWrite=!n,r.userData.pale!==n&&(r.userData.pale=n,r.needsUpdate=!0)}e.mesh.castShadow=!n,this.stage.shadowsChanged()}fallOff(e,t,n,r=0,i=performance.now()){let a=Math.hypot(t,n)||1;t/=a,n/=a;let o=e.base,s=e.base,c=1,l=[];if($[e.type].drape){let{xyz:t,fold:n}=this.drawnNow(e,performance.now(),!1);this.writeGrid(e,t,n);let r=ub(e.asset,Lw);for(let e=0;e<r.length;e++)r[e]&&l.push(t[e*3],t[e*3+1],t[e*3+2]);let[i,a]=Qw(e,t);s=i-$[e.type].thick/11,o=(s+a)/2,this.stack.bendOf(e)>0&&a-s>sw&&(c=sw/(a-s))}let u=0,d=0;$[e.type].drape||(this.normal.set(0,0,1).applyQuaternion(e.mesh.quaternion),this.normal.z>.001&&(u=-this.normal.x/this.normal.z,d=-this.normal.y/this.normal.z));let f=WS*JS,p=GS;if(c<1){let[r,i]=this.stage.toScreen(this.pivot.set(e.x+t*KS,e.y+n*KS,0)),a=this.host.getBoundingClientRect();p=r>=a.left&&r<=a.right&&i>=a.top&&i<=a.bottom?KS:GS}let m=l.length>0?l:e.mesh.geometry.getAttribute(`position`).array,h=l.length>0?$[e.type].thick/11:0,g=(l.length>0?s:e.base)-zf,_=c===1&&g>Kx&&this.overHigh(e,m,l.length>0?s:e.base)<tC?g:0;c===1&&(p=_>0?Math.max(GS,this.clearRun(e,t,n,m)-r*Jx(_)/2):Math.max(this.clearRun(e,t,n,m),r*f)),this.stack.takeOff(e),this.stage.contactScene.remove(e.foot),this.selected===e&&this.select(null);let v=i,y={p:e,dx:t,dy:n,ax:u,ay:d,run:p,go:0,fell:_,fellMs:_>0?Jx(_):0,speed:r,body:m,thick:h,up:0,start:v,high:o,low:s,flat:c,land:f,lift:0,drop:0,seen:v};l.length>0&&this.fallClear(y,l),y.go=_>0?0:Math.min(1,r*y.land/y.run),this.falling.push(y),this.opts.onChange?.()}overHigh(e,t,n){e.mesh.updateMatrix();let r=e.mesh.matrix.elements,i=this.drawnTopsNow(e),a=3*Math.max(1,Math.ceil(t.length/3/nC)),o=0,s=0;for(let e=0;e+2<t.length;e+=a,o++){let a=(r[0]*t[e]+r[4]*t[e+1]+r[8]*t[e+2]+r[12]+.5)*128-.5,o=(.5-(r[1]*t[e]+r[5]*t[e+1]+r[9]*t[e+2]+r[13]))*128-.5;a<0||o<0||a>127||o>127||i[Math.floor(o)*128+Math.floor(a)]>n-Kx&&s++}return o>0?s/o:0}clearRun(e,t,n,r){let i=this.breadCells(),a=(e,t)=>Math.abs(e)<.5&&Math.abs(t)<.5&&i[Math.floor((.5-t)*128)*128+Math.floor((e+.5)*128)]===1,o=Math.cos(e.rot),s=Math.sin(e.rot),c=3*Math.max(1,Math.ceil(r.length/3/nC)),l=new Float32Array(2*Math.ceil(r.length/c)),u=0,d=0;for(let e=0;e+2<r.length;e+=c){let i=o*r[e]-s*r[e+1],a=s*r[e]+o*r[e+1];l[u++]=i,l[u++]=a,d=Math.max(d,-(i*t+a*n))}let f=.5/128,p=0;if(a(e.x,e.y))for(;p<1.5&&a(e.x+t*p,e.y+n*p);)p+=f;else for(;-p<d&&!a(e.x+t*p,e.y+n*p);)p-=f;let m=Math.max(GS,p+d),h=m+2*Hb(e),g=0;for(;m<h;m+=QS){let r=e.x+t*m,i=e.y+n*m;if(g<u&&a(r+l[g],i+l[g+1]))continue;let o=-1;for(let e=0;e<u&&o<0;e+=2)a(r+l[e],i+l[e+1])&&(o=e);if(o<0)break;g=o}return m+QS}fallLow(e,t=1){e.p.mesh.updateMatrix();let n=e.p.mesh.matrix.elements,r=e.body,i=1/0;for(let e=0;e+2<r.length;e+=3*t){let t=n[2]*r[e]+n[6]*r[e+1]+n[10]*r[e+2]+n[14];t<i&&(i=t)}return i-e.thick}fallClear(e,t){let n=e.p,r={pts:Float32Array.from(t),under:$[n.type].thick/11+5e-4,sunk:0};this.fallPose(e,0),n.mesh.updateMatrix();let i=n.mesh.matrix.elements,a=this.drawnTopsNow(n),o=[],s=0;for(let e=0;e<r.pts.length;e+=3){let t=ZC(r,e,i,a);t>XS||(o.push(r.pts[e],r.pts[e+1],r.pts[e+2]),t>s&&(s=t))}if(e.over={pts:Float32Array.from(o),under:r.under,sunk:s},this.fallPose(e,1),this.fallShort(e)<=YS){e.over=void 0;return}let c=e.run+2*Math.max(n.halfObjW,n.halfObjH);for(;e.run<c&&(e.run+=ZS,this.fallPose(e,1),!(this.fallShort(e)<=QS)););e.land=Math.max(e.land,1e3*Math.sqrt(2*e.run/HC))}fallShort(e){let t=e.over;if(!t)return 0;e.p.mesh.updateMatrix();let n=e.p.mesh.matrix.elements,r=this.drawnTopsNow(e.p),i=0;for(let e=0;e<t.pts.length;e+=3)i=Math.max(i,ZC(t,e,n,r)-t.sunk);return i}fallPose(e,t,n=+(t>0)){let r=e.p,i=e.flat<1,a=e.speed*e.fellMs*(n-n*n/2)+e.run*(i?t*t:e.go*t+(1-e.go)*t*t),o=Math.sin(t*Math.PI/2),s=i?zf/Math.max(r.halfObjW,r.halfObjH)*o:Math.tan(qS*Math.PI/180)*Math.sin(t*Math.PI),c=this.lean(r.mesh.quaternion,e.ax*(1-o)-e.dx*s,e.ay*(1-o)-e.dy*s,r.rot),l=(r.base-e.fell)*(1-t*t)+e.fell*(1-n*n);if($[r.type].drape){let o=1-t*t*(1-e.flat);r.mesh.scale.z=o;let s=e.low*(1-o)-(e.low-e.fell-(i?zf/2:0))*t*t-e.fell*n*n;this.pivot.set(0,0,e.high*o).applyQuaternion(c),r.mesh.position.set(r.x+e.dx*a-this.pivot.x,r.y+e.dy*a-this.pivot.y,e.high*o+s-this.pivot.z)}else r.mesh.position.set(r.x+e.dx*a,r.y+e.dy*a,l)}showFalls(e){for(let t=this.falling.length-1;t>=0;t--){let n=this.falling[t],r=n.p,i=Math.min(1,Math.max(0,(e-n.start-n.fellMs)/n.land));this.fallPose(n,i,n.fellMs>0?Math.min(1,(e-n.start)/n.fellMs):1);let a=this.fallShort(n),o=Math.min(50,e-n.seen)/1e3;if(n.seen=e,n.drop+=$S*o,n.lift=Math.max(a,n.lift-n.drop*o),n.lift<=a&&(n.drop=0),r.mesh.position.z+=n.lift,n.landed===void 0&&(n.up=this.fallLow(n,8)<rC?Math.max(0,-this.fallLow(n)):0),r.mesh.position.z+=n.up,n.landed===void 0&&(i>=1&&n.lift<=0||e-n.start>n.fellMs+n.land+eC)&&(n.landed=e),n.landed===void 0)continue;let s=Math.min(1,(e-n.landed)/(WS*.4));this.fade(r,1-s),s<1||(this.falling.splice(t,1),this.stage.scene.remove(r.mesh),this.dispose(r))}this.stage.needsRender=!0,this.stage.shadowsChanged()}probe(e,t,n=!1){this.closeOpenSlide(),this.putOff(),this.stack.put=e;let r=this.request(null,!0);n&&(r.still=!0),this.probing={seq:r.seq,p:e,at:t},e.probedAt={x:e.x,y:e.y,rot:e.rot,at:t},this.settler.settle(r,e=>this.probed(e),e=>{this.threadError=e??`gone`,this.probing=null})}putOff(){this.pending&&=(this.pending.fine?this.fineDue={key:this.pending.key,free:this.pending.free,slide:!1}:this.dropped=this.pending,null)}foreseen(e,t,n,r){return{x:t.x,y:t.y,rot:t.rot,xyz:e.xyz,shift:e.shift,top:e.xyz?ow(e.xyz)[1]:-1/0,ax:e.ax,ay:e.ay,slips:n,stuck:e.stuck,hold:e.hold,since:r,from:null,fold:e.fold,fromFold:null,fromAx:0,fromAy:0,lie:e}}probed(e){let t=this.probing;if(!t||e.seq!==t.seq)return;this.probing=null,this.carry?.p===t.p&&this.carry.still++,this.probeAfter=performance.now()+(performance.now()-t.at)*_C,this.probeLog.push({at:performance.now(),ms:e.ms,rests:e.plateLog.map(e=>({type:e.type,loads:e.loads,rounds:e.rounds,converged:e.converged,ms:e.ms}))}),this.probeLog.length>cw&&this.probeLog.shift(),t.p.probedAt&&(t.p.probedAt.resting=e.plateLog.every(e=>e.id!==t.p.id||e.converged));let n=t.p,r=n.probedAt;if(!r||this.placed[this.placed.length-1]!==n||!this.threadShapes(n))return;let i=e.pieces.find(e=>e.id===n.id);if(!i)return;let a=performance.now(),o=null,s=Zw(n);i.xyz&&(o=aT(n.foresight?.from,n.xyz.length),o.set(s.xyz.length===o.length?s.xyz:n.xyz));let c=n.ease;c&&(n.ax=c.ax,n.ay=c.ay,i.xyz&&s.fold&&n.fold&&s.fold!==n.fold&&n.fold.set(s.fold),n.ease=void 0),n.foresight={...this.foreseen(i,r,e.slips,a),from:o,fromFold:i.xyz?n.fold?.slice()??null:null,fromAx:n.ax,fromAy:n.ay},this.reshapeTop(n,a)&&this.reshow(n,a)}reshapeTop(e,t,n=!0){let r=e.foresight;if(!r||!this.threadShapes(e))return!1;let i=PC(Math.min(1,(t-r.since)/wC)),a=e.lift>0&&!!r.slips&&this.stack.bendOf(e)===0,o=a?r.xyz?CC(r.steep??=$w(e,r.xyz)):Math.min(1,xC/Math.hypot(r.ax,r.ay)):1,s=(e.lift===0?1:Math.max(0,1-Math.hypot(e.x-r.x,e.y-r.y)/yC))*o;if(r.xyz&&r.from){if(r.xyz.length!==e.xyz.length)return!1;let t=e.lift===0;!t&&(n||r.hoverTop===void 0)&&(r.hoverTop=ow(e.xyz)[1]);let o=t?r.top:r.hoverTop,c=(o-r.top)*(a?1:1-(e.setDown??0)),l=r.from,u=e.rest;for(let t=0,n=0;n<l.length;t++,n+=3){let a=u[t*2],d=u[t*2+1],f=a+(r.xyz[n]-a)*s,p=d+(r.xyz[n+1]-d)*s,m=o+(r.xyz[n+2]+c-o)*s;e.xyz[n]=l[n]+(f-l[n])*i,e.xyz[n+1]=l[n+1]+(p-l[n+1])*i,e.xyz[n+2]=l[n+2]+(m-l[n+2])*i}let d=e.fold;if(d&&r.fold&&r.fromFold&&d.length===r.fold.length&&r.fromFold.length===d.length){let t=this.stack.gridLayers(e),n=$[e.type].thick/11;for(let e=0,a=0;a<d.length;e++,a+=3){let o=t?n*(t[e]-1):0;d[a]=r.fromFold[a]+(r.fold[a]*s-r.fromFold[a])*i,d[a+1]=r.fromFold[a+1]+(r.fold[a+1]*s-r.fromFold[a+1])*i,d[a+2]=r.fromFold[a+2]+(o+(r.fold[a+2]-o)*s-r.fromFold[a+2])*i}}t||this.clampAbove(e,r.stuck?RS:1/0,ub(e.asset,Lw)),e.flatAt=null,e.ver++}else e.ax=r.fromAx+(r.ax*s-r.fromAx)*i,e.ay=r.fromAy+(r.ay*s-r.fromAy)*i;return e.shapedTick=this.ticks,!0}rockBy(e,t,n,r){this.axis.set(-t[1],t[0],0),this.rock.setFromAxisAngle(this.axis,n);let i=Math.max(e.halfObjW,e.halfObjH)*Math.sin(Math.abs(n));this.show(e,r),e.mesh.quaternion.premultiply(this.rock);let a=e.mesh.position;if($[e.type].drape){let t=this.stack.topOf(e)-e.lift;this.pivot.set(0,0,t).applyQuaternion(this.rock),a.set(a.x-this.pivot.x,a.y-this.pivot.y,a.z+t-this.pivot.z+i)}else a.z+=i;e.rocked={dir:[t[0],t[1]],angle:n},this.stage.needsRender=!0,this.stage.shadowsChanged()}clampAbove(e,t=1/0,n=null){let r=this.stack.gridsBelow,i=this.drawnTopsNow(e),[a,o]=ow(e.xyz),s=o-t,c=Math.max(e.w,e.h),l=$[e.type].thick/11*(Math.hypot(c,o-a)/c)+5e-4,u=Math.cos(e.rot),d=Math.sin(e.rot),f=0;for(let t=0;t<e.xyz.length;t+=3){if(e.xyz[t+2]<s||n&&!n[t/3])continue;let a=e.xyz[t],o=e.xyz[t+1],c=e.x+a*u-o*d,p=e.y+a*d+o*u,m=r.sup[m_(c,p)];m<zf&&this.opts.onSlice?.(c,p)&&(m=zf);let h=(c+.5)*128-.5,g=(.5-p)*128-.5,_=Math.min(127,Math.max(0,Math.floor(h))),v=i[Math.min(127,Math.max(0,Math.floor(g)))*128+_];v>m&&(m=v),m+=l,e.xyz[t+2]<m&&(f=Math.max(f,m-e.xyz[t+2]))}if(f===0)return!1;for(let t=2;t<e.xyz.length;t+=3)e.xyz[t]+=f;return e.flatAt!==null&&(e.flatAt+=f),e.ver++,!0}drawnTopsNow(e){let t=this.drawnFrom,n=Hb(e),r=performance.now()+EC,i=!0,a=0;for(let o of this.placed){if(o===e||o.lift>0||Math.hypot(o.x-e.x,o.y-e.y)>n+Hb(o))continue;this.staleDrawn(o)&&(!o.drawn||performance.now()<r)&&this.readDrawn(o);let s=o.drawn;(t.near[a]!==o||t.read[a]!==s)&&(i=!1,t.near[a]=o,t.read[a]=s),a++}let o=this.drawnQuad;if(i&&t.near.length===a)return o;t.near.length=a,t.read.length=a,o.fill(-1/0);let s=(e,t)=>{t>o[e]&&(o[e]=t)};for(let e of t.read)for(let t=0;t<e.cells.length;t++){let n=e.cells[t],r=e.tops[t],i=n%128;s(n,r),i>0&&s(n-1,r),n>=128&&(s(n-128,r),i>0&&s(n-128-1,r))}return o}staleDrawn(e){let t=e.drawn;return!t||t.ver!==e.ver||t.x!==e.x||t.y!==e.y||t.rot!==e.rot}readRestIdle(){this.readingRest||(this.readingRest=!0,mx(e=>{this.readingRest=!1;let t=this.placed[this.placed.length-1],n=!!t&&t.lift>0&&$[t.type].drape,r=performance.now()+Math.min(DC,e?.timeRemaining()??DC);for(let e of this.placed)if(!(e.lift>0||e.drawn&&!(n&&this.staleDrawn(e)))){if(performance.now()>=r)return this.readRestIdle();this.readDrawn(e)}}))}readDrawn(e){if($[e.type].drape){vb(e);return}let t=this.stack.thickOf(e),[n,r]=U_(e.ax,e.ay,e.rot,1,0,0),[i,a]=U_(e.ax,e.ay,e.rot,0,1,0),[o,s]=U_(e.ax,e.ay,e.rot,0,0,1),c=e.asset,l=e.base+e.lift,[u,d,f,p]=Ub(e),m=this.readCells,h=this.readTops,g=0;for(let _=f;_<=p;_++){let f=d_(_);for(let p=u;p<=d;p++){let u=u_(p),d=this.stack.undersideAt(e,u,f)+t,v=u-e.x,y=f-e.y,b=d-l;Sy(c,(v*n+y*i+b*o)/e.w+e.cx,e.cy-(v*r+y*a+b*s)/e.h)&&(m[g]=_*128+p,h[g]=d,g++)}}e.drawn={ver:e.ver,x:e.x,y:e.y,rot:e.rot,cells:m.slice(0,g),tops:h.slice(0,g)}}arriveTop(e,t){let n=e.foresight;if(!n){if(!e.setDown)return;e.setDown=0,e.lift>0&&this.reshow(e,t);return}let r=t-n.since;r>180||(e.setDown=Math.max(e.setDown??0,PC(Math.min(1,r/wC))),e.shapedTick!==this.ticks&&(this.reshapeTop(e,t,!1),this.reshow(e,t)))}setDownBy(e){return e.setDown?e.setDown*Math.max(0,e.lift-TC):0}heldZ(e,t,n){return $[e.type].drape?ib(e)(t,n)+e.lift:this.stack.undersideAt(e,t,n)+this.stack.thickOf(e)}startCarry(e,t,n,r){e.levelTop=void 0,this.carry={p:e,clientX:0,clientY:0,offX:t,offY:n,z:r,aimed:NaN,planeX:NaN,planeY:NaN,movedAt:0,vx:0,vy:0,ahead:!1,still:0,stillX:NaN,stillY:NaN,ray:new vi}}carryTo(e,t){let n=this.carry;if(!n)return!1;n.clientX=e,n.clientY=t;let r=performance.now();if(this.stage.rayThrough(e,t,n.ray),this.stage.rayOnPlane(zf,this.drawHit,void 0,n.ray)){let e=r-n.movedAt;e>0&&e<eS&&!Number.isNaN(n.planeX)?(n.vx+=((this.drawHit.x-n.planeX)/e-n.vx)*.5,n.vy+=((this.drawHit.y-n.planeY)/e-n.vy)*.5):n.vx=n.vy=0,n.planeX=this.drawHit.x,n.planeY=this.drawHit.y,n.movedAt=r,Math.hypot(n.planeX-n.stillX,n.planeY-n.stillY)<=pC||(n.still=0,n.stillX=n.planeX,n.stillY=n.planeY)}return Number.isNaN(n.aimed)||(n.z=this.heldZ(n.p,n.p.x-n.offX,n.p.y-n.offY)),n.aimed=NaN,this.aimCarry(performance.now(),!0)}aimCarry(e,t=!1){let n=this.carry;if(!n)return!1;let r=n.z-this.setDownBy(n.p)+this.dropAt(n.p,e);return Math.abs(r-n.aimed)<NS||(t||this.stage.rayThrough(n.clientX,n.clientY,n.ray),!this.stage.rayOnPlane(r,this.carryHit,void 0,n.ray))?!1:(n.aimed=r,n.p.x=this.carryHit.x+n.offX,n.p.y=this.carryHit.y+n.offY,!0)}turnsOnThread(e){return this.settler instanceof Hx||this.stack.bendOf(e)===0?!1:this.turning&&this.selected===e||e.lift>0||this.shove?.p===e}threadShapes(e){return(e.lift>0||this.turnsOnThread(e))&&this.stack.laidTop(e)&&!e.gone}rockTop(e,t){let n=this.placed[this.placed.length-1];if(!n)return;if(!this.threadShapes(n)){let t=n.foresight&&n.lift>0?this.drawnNow(n,e):null;n.foresight=null,n.probedAt=void 0,t&&(n.setDown=0,this.startEase(n,t,e,!0))}else if(!this.probing&&!this.pending?.held&&e>=this.probeAfter&&!(this.settler instanceof Hx)){let t=n.probedAt,r=this.carry,i=SC(t?e-t.at:null,!!t&&!OC(n,t,pC,mC),!!t&&!OC(n,t,vC,mC/10),t?.resting,!!r&&r.p===n&&r.still>=2);i.ask&&this.probe(n,e,i.held)}let r=!!n.rocked;n.rocked=void 0;let i=n.unrock;if(i){if(n.lift===0&&(n.slide?.open?.held||this.down.some(e=>e.p===n&&!!e.away))){i.size+=(1-i.size)*QC(e-t,sC),i.from=aw(e)*i.size,i.start=e,this.rockBy(n,i.dir,i.from,e);return}let r=(e-i.start)/oC;if(r<1&&n.lift===0){this.rockBy(n,i.dir,i.from*(1-PC(r)),e);return}n.unrock=void 0}this.arriveTop(n,e);let a=n.lift>0&&(n.gone||!n.foresight?.slips&&this.offStulle(n))?this.outward(n):n.foresight?.slips??null;a&&!n.rockOn&&this.opts.onRock?.(),n.rockOn=!!a;let o=n.rockVec??(a?[0,0]:null),s=0;if(o){let n=QC(e-t,sC);o[0]+=((a?a[0]:0)-o[0])*n,o[1]+=((a?a[1]:0)-o[1])*n,s=Math.hypot(o[0],o[1])}n.rockVec=o&&(a||s>.02)?o:void 0,o&&s>.02?this.rockBy(n,[o[0]/s,o[1]/s],aw(e)*Math.min(1,s),e):r&&this.reshow(n,e)}tick(e){this.ticks++;let t=this.lastTick;this.lastTick=e;let n=this.carry;if(n&&this.placed.includes(n.p)){let t=this.heldZ(n.p,n.p.x-n.offX,n.p.y-n.offY);n.z=Math.abs(t-n.z)<NS?t:n.z+(t-n.z)*PS,this.aimCarry(e)&&(this.queueSettle(`top`),n.p.gone=this.lostCarried(n.p))}this.letGone&&this.probing?.seq!==this.letGone.seq&&this.landLetGo(),this.shoveStep(e,e-t),this.settleAfter>0&&(this.settleQueued!==null||--this.settleAfter===0)?this.settleRest():this.settleQueued===`all`?this.settle():this.settleQueued===`top`&&this.settleTop(),this.settleDown(),this.nextTap(),this.askFineDue(),e=performance.now();let r=this.sliding;if(r?.slide){let n=r.slide;n.open?.held&&(n.start=e);let i=VC(n,e);r.x=n.fromX+(n.toX-n.fromX)*i,r.y=n.fromY+(n.toY-n.fromY)*i;let a=n.path&&i<1?NC(n.path,i,Math.max(r.halfObjW,r.halfObjH)):null;a&&Object.assign(r,a),n.open&&this.askOpenSlide(r);let o=n.landSince!==void 0&&e-n.landSince<150;if(i>=1&&!n.open&&!o){let t=n.off?this.slideWays(r):null,i=t?BC(t.all,n.ms)*t.out:0,a=n.off?Math.min(e,n.start+zC(1)*n.ms):e;r.slide=null,this.sliding=null;let o=r.ease?.to?this.drawnNow(r,e):null;r.ease&&(r.ease.to=null,r.ease.at=void 0);let s=r!==this.placed[this.placed.length-1],c=this.endsOnBread(n.toX,n.toY),l=!s&&!!this.avoid?.ids.has(r.id)&&this.stack.laidTop(r);l&&this.stack.gridsFromBelow(),this.goingTo.delete(r),c?r.slid++:this.fallOff(r,n.toX-n.fromX,n.toY-n.fromY,i,a),l&&this.avoid&&(this.avoid.ids.delete(r.id),this.avoid.ids.size===0&&(this.avoid=null),this.heldKey=this.weighing()),s?this.settleRest():c?this.putDown(r,o,!1,!!n.steps&&this.laySlideEnd(r,n.steps)||!!n.end&&this.lieSlideEnd(r,n.end)):this.stack.settled||this.settleRest()}else if(n.land){r.ease||this.startEase(r,this.drawnNow(r,e),e,!0);let t=r.ease;t?.fromXyz&&t.fromXyz.length===n.land.length&&(t.to=n.land,t.at=YC(XC(i,n.landFrom??0,n.landSince,e))),this.show(r,e)}else if(a||r!==this.placed[this.placed.length-1])this.show(r,e);else{let a=$[r.type].drape,o=a&&!r.ease?this.drawnNow(r,e):null,s=!!a&&this.stack.bendOf(r)===0;n.steps?this.laySlideStep(r,n.steps,i,e,!s):n.open?s||this.showSliding(r,e):a?this.settleTop():this.showSliding(r,e),s&&(this.temperSlide(r),this.showSliding(r,e)),a&&this.followSlide(r,o,e,e-t)}this.stage.shadowsChanged()}this.falling.length>0&&this.showFalls(e),this.askDropped(),n&&n.ahead&&performance.now()-n.movedAt>=eS&&(n.ahead=!1,this.queueSettle(`top`));let i=this.followHover(e-t),a=this.asideCarried(e);this.rockTop(e,t);let o=this.hovering??this.aside.p;(i||a)&&o&&(o.rocked||o.mesh.position.set(o.x+(this.aside.p===o?this.aside.x:0),o.y+(this.aside.p===o?this.aside.y:0),this.shownZ(o,e)),this.stage.shadowsChanged());let s=!1;for(let t of this.placed)t.ease&&(!t.rocked&&t.easedTick!==this.ticks&&this.show(t,e),s=!0),t.drop&&(this.showDrop(t,e),s=!0);s&&(this.stage.needsRender=!0,this.stage.shadowsChanged()),this.placeCuesDue(),this.releaseIdlers();for(let t of this.placed){if(!t.shake)continue;let n=(e-t.shake)/220,r=n>=1?0:Math.sin(n*Math.PI*3)*(1-n)*.006;t.mesh.position.x=t.x+r,n>=1&&(t.shake=0),this.stage.needsRender=!0,this.stage.shadowsChanged()}}asideCarried(e){let t=this.carry,n=this.aside,r=0,i=0,a=t&&!Number.isNaN(t.aimed)&&t.p.lift>0&&this.placed.includes(t.p)?t.p:null;if(t&&a){let n=a.x-t.offX,o=a.y-t.offY,s=this.heldZ(a,n,o)-this.setDownBy(a)+this.dropAt(a,e)+(a.hover?a.hover.off:0),c=$[a.type].drape&&a.ease?.xyz?a.ease.xyz:null;c&&c.length===a.xyz.length&&(s+=ib({x:a.x,y:a.y,rot:a.rot,w:a.w,h:a.h,cx:a.cx,cy:a.cy,xyz:c})(n,o)-ib(a)(n,o)),Math.abs(s-t.aimed)>=NS&&this.stage.rayOnPlane(t.aimed,this.carryHit,void 0,t.ray)&&this.stage.rayOnPlane(s,this.drawHit,void 0,t.ray)&&(r=this.drawHit.x-this.carryHit.x,i=this.drawHit.y-this.carryHit.y)}let o=n.p!==a||n.x!==r||n.y!==i;return n.p&&n.p!==a&&!this.falling.some(e=>e.p===n.p)&&(n.p.mesh.position.x-=n.x,n.p.mesh.position.y-=n.y),n.p=a,n.x=r,n.y=i,o&&(a!==null||r!==0||i!==0)}settle(e=this.slidingTop(),t,n=!1){this.closeOpenSlide(),this.dropped=null,this.settleQueued=null,this.settleAfter=0,t&&this.afterSettle.push({then:t,slideTop:n});let r=this.sceneKey(e);if(this.pending&&this.pending.key!==r&&(this.pending=null),this.pending){this.again=!0,this.hoverTop();return}let i=performance.now(),a=this.request(e);this.afterSettle.some(e=>e.slideTop)&&(a.slideTop=!0),this.probing=null,this.pending={seq:a.seq,key:r,free:e,began:i,...this.holdNext?{held:!0}:{},...a.fine?{fine:!0}:{},...this.restNext?{rest:!0}:{},...this.loadNext?{load:!0}:{}},this.holdNext=!1,this.restNext=!1,this.hoverTop(),this.settler.settle(a,e=>this.settled(e),t=>{this.keptIsLaid(),this.threadError=t??`gone`,this.settler instanceof Hx?(this.pending=null,this.afterSettle=[],this.releaseIdlers()):(this.settler=new Hx,this.forgetHost(),this.pending=null,this.settle(e))},()=>this.keptIsLaid())}request(e,t=!1){let n;t&&this.spreadSampled?n=this.spreadSampled.slice():(n=new Float32Array(16384),this.sampleSpread(n),this.spreadSampled=n.slice());let r={};for(let e of this.placed){let t=Ax(e.type,e.v);this.sentAssets.has(t)||(this.sentAssets.add(t),r[t]=oT(e.asset))}let i=this.placed.length-1,a;return!t&&!this.sentBread&&(a=this.breadCells(),this.sentBread=!0),{seq:++this.settleSeq,pieces:this.placed.map((e,n)=>({id:e.id,type:e.type,v:e.v,x:e.x,y:e.y,rot:e.rot,lift:t&&n===i?0:e.lift,ver:n<i&&e.lift===0&&e.lie?.at===e.ver?e.lie.ver:void 0})),assets:r,spread:n,free:e?.id??null,put:this.stack.put?.id??null,bends:{...this.stack.bends},sliceTop:zf,probe:t,...!t&&this.fineFor!==null&&!(this.settler instanceof Hx)&&this.fineFor===this.sceneKey(e)?{fine:!0}:{},...a?{bread:a}:{}}}hoverTop(){let e=this.placed[this.placed.length-1];e&&e.lift>0&&this.layTop(e)}layTop(e){this.stack.gridsBelowOf!==e&&this.stack.carryOn(e),this.layCarried(),this.showTop(e,performance.now())}aheadOf(e){let t=this.carry;if(!t||t.p!==e||e.lift<=0||performance.now()-t.movedAt>=eS)return null;let n=Math.hypot(t.vx,t.vy)*Zx;if(n<$x)return null;let r=Math.min(n,Qx)/n*Zx;return[t.vx*r,t.vy*r]}layCarried(){let e=this.placed[this.placed.length-1],t=e?this.aheadOf(e):null;this.stack.ahead=t;let n=!1;try{n=this.stack.settleTop()}finally{this.stack.ahead=null}return this.carry&&this.carry.p===e&&(this.carry.ahead=n&&t!==null),n&&e&&e.lift>0&&$[e.type].drape&&this.stack.bendOf(e)===0&&(e.levelTop=ow(e.xyz)[1]),n}showTop(e,t){!this.reshapeTop(e,t)&&e.lift>0&&$[e.type].drape&&this.clampAbove(e,1/0,ub(e.asset,Lw)),this.show(e,t)}breadCells(){if(!this.breadMask){let e=new Uint8Array(16384);for(let t=0;t<128;t++)for(let n=0;n<128;n++)e[t*128+n]=+!!this.opts.onBread(u_(n),d_(t));this.breadMask=e}return this.breadMask}endsOnBread(e,t){return Math.abs(e)<=.5&&Math.abs(t)<=.5&&this.breadCells()[m_(e,t)]===1}sampleSpread(e){for(let t=0;t<128;t++)for(let n=0;n<128;n++)e[t*128+n]=this.opts.surfaceAt(u_(n),d_(t))}sceneKey(e){return`${this.stack.weighKey(e)}#${e?.id??``}`}settled(e){let t=this.pending;if(!t||e.seq!==t.seq){if(t||this.dropped?.seq!==e.seq)return;t=this.dropped,this.dropped=null}if(this.pending=null,t.key===this.sceneKey(t.free)){let n=!!t.rest,r=!!t.load;(n||r)&&(r&&e.plateLog.some(e=>e.coarseShell)||this.finishRests(e,t.key),this.finishFine(e,t)),n&&this.again||(this.adopt(e,t.began,r&&this.again),!n&&!r&&(this.finishRests(e,t.key),this.finishFine(e,t)))}else this.again=!0;if(this.keptIsLaid(),this.again){this.again=!1;let e=this.fineFree;this.fineFree=void 0,e!==void 0&&this.fineSlide?this.settle(e,e=>this.afterFine(e),!0):e===void 0?this.settle():this.settle(e)}this.releaseIdlers()}finishRests(e,t){if(e.fine||!iw(e.plateLog.filter(e=>!e.fine))||this.carry||this.sliding||this.settler instanceof Hx){this.finishing=null;return}let n=this.finishing?.key===t?this.finishing.run+1:1;this.finishing={key:t,run:n},n<=lC&&(this.again=this.restNext=!0)}finishFine(e,t){this.fineFor=null,this.fineDue=null,e.fine||this.settler instanceof Hx||this.again||e.plateLog.some(e=>e.coarseShell||e.open)&&(this.carry||this.carrying||this.sliding||this.down.length>0||this.settleQueued||this.tapsOn?this.fineDue={key:t.key,free:t.free,slide:e.topSlide!==void 0}:(this.fineFor=t.key,this.fineFree=t.free,this.fineSlide=e.topSlide!==void 0,this.again=!0))}get tapsOn(){return this.taps.length>0||this.tapping!==null||performance.now()-this.tappedAt<dS}askFineDue(){let e=this.fineDue;!e||this.pending||this.probing||this.carry||this.carrying||this.sliding||this.down.length>0||this.settleQueued||this.settleAfter>0||this.tapsOn||(this.fineDue=null,e.key===this.sceneKey(e.free)?(this.fineFor=e.key,e.slide?this.settle(e.free,e=>this.afterFine(e),!0):this.settle(e.free)):this.releaseIdlers())}afterFine(e){let t=this.placed[this.placed.length-1];!t||this.carry||this.sliding||t.lift>0||t.slid>=VS||this.slideToRest(t,!1,e=>e&&this.opts.onTopping?.(`remove`),e.topSlide)}adopt(e,t,n=!1){let r=performance.now(),i=this.placed.map(e=>e.laid&&e.lift===0?this.stack.topOf(e)+this.dropAt(e,r):NaN),a=this.placed.map(e=>e.shown&&e.lift===0&&!e.drop?.fall?this.drawnNow(e,r,!1):null);if(zx(this.stack,e),this.sliding||(this.avoid=null),this.placed.forEach((e,t)=>{if(e.lift>0)return;e.laid=!0;let n=a[t];if(!e.drop?.fall){let a=i[t]-this.stack.topOf(e);e.drop=Math.abs(a)>Wx&&!iT(e,n)?Xx(e.drop,a,r):void 0}n&&this.startEase(e,n,r),this.show(e,r)}),this.stage.shadowsChanged(),this.stage.needsRender=!0,this.placeHandle(),this.readRestIdle(),this.settleLog.push({at:t,ms:r-t,passes:e.passes,...e.taken?{taken:!0}:{}}),this.settleLog.length>cw&&this.settleLog.shift(),n)return;let o=this.afterSettle;this.afterSettle=[];for(let t of o)t.then(e);e.slip&&this.slideUnder(e.slip.id,e.slip.to,e.slip.path)}settleGone(){let e=this.placed[this.placed.length-1],t=!!e&&e.lift===0&&this.slidesOn(e)&&this.stack.slideDir(e)!==null;(!this.stack.settled||t)&&(this.settleAfter=2)}settleRest(){let e=this.placed[this.placed.length-1];if(!e||e.lift>0||!this.slidesOn(e))return this.settle();this.settle(void 0,t=>{this.down.some(t=>t.p===e)||this.placed[this.placed.length-1]===e&&this.slidesOn(e)&&this.slideToRest(e,!1,e=>e&&this.opts.onTopping?.(`remove`),t.topSlide)},!0)}slideUnder(e,t,n){if(this.sliding||this.carry||this.down.length>0)return;let r=this.placed.find(t=>t.id===e);!r||r.lift>0||r.slid>=VS||r===this.placed[this.placed.length-1]||this.setSliding(r,t,n)}setSliding(e,t,n,r=null,i=null){let a=this.supportHeld;this.goingTo.set(e,t),a&&this.avoidSlide(e,t);let o=this.stack.bendOf(e)>0,s=n.length>1?MC(n,Math.max(e.halfObjW,e.halfObjH)):{way:0,along:0},c=o?qC:Math.hypot(e.ax,e.ay),l=JC(Math.hypot(t[0]-e.x,t[1]-e.y)+s.way-s.along,c);e.slide={fromX:e.x,fromY:e.y,toX:t[0],toY:t[1],start:performance.now(),ms:l,lean:c,off:!o&&!this.endsOnBread(t[0],t[1]),...n.length>1?{path:n}:{}};let u=this.slipLand(e,r);!u&&this.liesFit(e,i)&&e===this.placed[this.placed.length-1]&&(e.slide.steps=i),u&&(e.slide.land=u,this.startEase(e,this.drawnNow(e,e.slide.start),e.slide.start,!0)),this.sliding=e,this.show(e,e.slide.start),this.stage.needsRender=!0}slipLand(e,t){return e.tips&&this.stack.bendOf(e)===0&&t&&e===this.placed[this.placed.length-1]&&t.length===e.xyz.length?t:null}liesFit(e,t){return!t||!$[e.type].drape||t.shapes.length===0||t.count<=0||t.at&&t.at.length!==t.shapes.length?!1:t.shapes.every(t=>t.xyz.length===e.xyz.length)}get settling(){return this.pending!==null||this.dropped!==null}askDropped(){let e=this.dropped;!e||this.pending||this.probing||this.sliding?.slide?.open||(this.holdNext=!0,this.settle(e.free))}get moving(){return this.sliding!==null||this.falling.length>0||this.placed.some(e=>e.drop)}forgetHost(){this.sentAssets.clear(),this.sentBread=!1;for(let e of this.placed)e.lie=void 0}whenIdle(){return this.idle?Promise.resolve():new Promise(e=>this.idlers.push(e))}get idle(){return!this.pending&&!this.dropped&&!this.moving&&this.down.length===0&&this.taps.length===0&&!this.tapping&&!(this.fineDue&&!this.carry)&&!this.letGone}get busy(){if(!this.idle||this.carry!==null||this.carrying||this.dragging||this.probing!==null||this.settleAfter>0||this.settleQueued!==null||this.fineDue!==null||this.idlers.length>0||this.taps.length>0||this.tapping!==null||this.placeCues.length>0)return!0;let e=this.placed[this.placed.length-1];return e&&(e.unrock||e.rocked||e.foresight)?!0:this.placed.some(e=>!!e.ease||!!e.drop||!!e.shake)}releaseIdlers(){if(!this.idle||this.idlers.length===0)return;let e=this.idlers;this.idlers=[];for(let t of e)t()}laySlideStep(e,t,n,r,i=!0){let{i:a,f:o}=kC(n,t.count,t.shapes.length,t.at),s=t.shapes[a],c=t.shapes[a+1]??s,l=e.xyz;for(let e=0;e<l.length;e++)l[e]=s.xyz[e]+(c.xyz[e]-s.xyz[e])*o;if(e.fold&&s.fold&&c.fold&&s.fold.length===e.fold.length&&c.fold.length===e.fold.length)for(let t=0;t<e.fold.length;t++)e.fold[t]=s.fold[t]+(c.fold[t]-s.fold[t])*o;let u=o<.5?s:c;e.shift=u.shift,e.stuck=u.stuck,e.hold=u.hold;let d=e.ground;if(d){let e=s.ground?.length===d.length?s.ground:null,t=c.ground?.length===d.length?c.ground:null;for(let n=0;n<d.length;n++)d[n]=e&&t&&e[n]>Rw/2&&t[n]>Rw/2?e[n]+(t[n]-e[n])*o:Rw}e.flatAt=s.flatAt!==null&&c.flatAt!==null?u.flatAt:null,e.ver++,i&&this.showSliding(e,r)}laySlideEnd(e,t){let n=t.shapes[t.count];if(this.stack.bendOf(e)===0||t.at||!n||t.shapes.length!==t.count+1||n.xyz.length!==e.xyz.length||!this.stack.laidTop(e))return!1;e.xyz.set(n.xyz),e.fold&&n.fold&&n.fold.length===e.fold.length&&e.fold.set(n.fold),e.shift=n.shift;let r=0;if(n.shift)for(let e of n.shift)r=Math.max(r,Math.abs(e));return e.shiftMax=r,e.stuck=n.stuck,e.hold=n.hold,e.flatAt=n.flatAt,n.ground&&e.ground?.length===n.ground.length&&e.ground.set(n.ground),e.tips=n.tips,e.draped=void 0,e.drawnIn=void 0,e.ver++,e.shown=void 0,this.stack.laidAlone=e,this.stage.shadowsChanged(),this.placeHandle(),!0}lieSlideEnd(e,t){return!this.stack.laidTop(e)||this.stack.bendOf(e)!==0||t.same||!t.xyz||t.xyz.length!==e.xyz.length?!1:(this.takeLie(e,t),!0)}temperSlide(e){let t=e.xyz,[n,r]=Qw(e,t);if(r<n||!e.rest)return!1;let i=$w(e,t),a=!1;if(i>xC*1.01){let o=CC(i),s=(n+r)/2,c=e.rest;for(let e=0,n=0;n<t.length;e++,n+=3){let r=c[e*2],i=c[e*2+1];t[n]=r+(t[n]-r)*o,t[n+1]=i+(t[n+1]-i)*o,t[n+2]=s+(t[n+2]-s)*o}e.flatAt=null,e.ver++,a=!0}let o=e.ground;return o&&o.some(e=>e>Rw/2)&&(o.fill(Rw),e.ver++,a=!0),this.clampAbove(e,1/0,ub(e.asset,Lw))||a}showSliding(e,t){this.showTop(e,t),this.stage.needsRender=!0,this.stage.shadowsChanged(),this.placeHandle()}settleTop(){let e=this.placed[this.placed.length-1];!e||!this.turnsOnThread(e)&&!this.layCarried()?this.settle():(this.settleQueued=null,this.showTop(e,performance.now()),this.stage.needsRender=!0,this.stage.shadowsChanged(),this.placeHandle())}slideToRest(e,t,n,r){if(!this.stack.laidTop(e)||e.lift>0)return n(!1);let i=e=>!!e&&!this.endsOnBread(e[0],e[1]);if(t){this.settle(e,e=>n(i(this.takeSlide(e.topSlide))),!0);return}let a=this.slipDir(e);if(!a)return n(!1);if(r!==void 0&&(r!==null||!this.offStulle(e)))return n(i(this.takeSlide(r)));this.slideOpen(e,a,e=>n(i(e)))}takeSlide(e){if(!e||this.sliding)return null;let t=this.placed[this.placed.length-1];return!t||t.id!==e.id||t.lift>0||!this.stack.laidTop(t)?null:(this.setSliding(t,e.to,e.path,e.land,e.steps),e.to)}slideOpen(e,t,n){let r=this.stack.bendOf(e)>0,i=!r&&!!$[e.type].drape,a=r||i?[yy(e)]:[],o=[{x:e.x,y:e.y,base:e.base,ax:e.ax,ay:e.ay}],s=r?hy:kv;this.setSliding(e,[e.x+t[0]*s,e.y+t[1]*s],[]),e.slide.open={dir:t,seq:0,shapes:a,at:i?[0]:null,slips:i&&!!e.tips,poses:o,found:n,held:!0},e.unrock??={dir:[t[0],t[1]],from:0,start:performance.now(),size:0},e.slide.off=!1,this.settler instanceof Hx?this.closeOpenSlide():this.askOpenSlide(e)}askOpenSlide(e){let t=e.slide,n=t?.open;if(!t||!n||n.seq!==0||this.probing&&this.probing.p!==e)return;this.probing=null,this.putOff();let r={x:e.x,y:e.y};e.x=t.fromX,e.y=t.fromY;let i=this.request(null,!0);e.x=r.x,e.y=r.y,i.slide={dir:n.dir,grids:this.stack.gridsBelow},n.seq=i.seq,this.settler.settle(i,t=>this.slideFound(e,i.seq,t.topSlide??null),()=>this.slideFound(e,i.seq,null),void 0,t=>this.slideNews(e,i.seq,t))}slidePlan(e,t,n,r,i=!1){let a=e.slide,o=VC(a,n)*this.slideWays(e).all;a.toX=t[0],a.toY=t[1],r&&r.length>1&&(a.path=r);let s=this.slideWays(e);a.off=i&&this.stack.bendOf(e)===0&&!this.endsOnBread(t[0],t[1]),a.ms=JC(s.timed,a.lean),a.start=n-(a.off?zC:LC)(s.all>0?o/s.all:1)*a.ms,this.goingTo.set(e,t)}slideWays(e){let t=e.slide,n=Math.hypot(t.toX-t.fromX,t.toY-t.fromY);if(!t.path)return{all:n,timed:n,out:1};let r=Math.max(e.halfObjW,e.halfObjH),i=MC(t.path,r),a=t.path[t.path.length-2],o=t.path[t.path.length-1],s=jC(a,o,r);return{all:i.way,timed:n+i.way-i.along,out:s>0?Math.hypot(o.x-a.x,o.y-a.y)/s:1}}setOff(e){let t=e.slide;t?.open?.held&&(t.open.held=!1,t.start=performance.now())}slideNews(e,t,n){let r=e.slide,i=r?.open;r&&i&&i.seq===t&&this.sliding===e&&(i.at?(n.shape&&n.shape.xyz.length===e.xyz.length&&i.shapes.length===i.at.length&&!i.slips&&(i.shapes.push(n.shape),i.at.push(n.count)),!i.slips&&i.shapes.length>0&&(r.steps={shapes:i.shapes,count:n.count,at:i.at})):(n.shape&&n.shape.xyz.length===e.xyz.length&&i.shapes.length===n.count&&i.shapes.push(n.shape),i.shapes.length===n.count+1&&(r.steps={shapes:i.shapes,count:n.count})),n.pose&&i.poses.length===n.count&&i.poses.push(n.pose),this.setOff(e),this.slidePlan(e,n.at,performance.now(),i.poses.length===n.count+1?i.poses.slice():void 0),this.stage.needsRender=!0)}slideFound(e,t,n){let r=e.slide,i=r?.open;if(!r||!i||i.seq!==t||this.sliding!==e)return;let a=n?.to??null,o=n?.steps??null,s=n?.path??null,c=n?.land??null;if(!a){let t={x:e.x,y:e.y};e.x=r.fromX,e.y=r.fromY,s=[],a=this.stack.laidTop(e)?this.stack.slide(e,i.dir,(e,t)=>this.endsOnBread(e,t),s):null,o=a?this.stack.slidSteps:null,c=a?this.stack.slidLand:null,e.x=t.x,e.y=t.y,a??=[r.toX,r.toY]}this.setOff(e),r.open=void 0,n?.end&&(r.end=n.end);let l=performance.now();c=this.slipLand(e,c),r.steps=!c&&i.shapes.length>0&&this.liesFit(e,o)?{shapes:[i.shapes[0],...o.shapes.slice(1)],count:o.count,...o.at?{at:o.at}:{}}:c?void 0:r.steps,this.slidePlan(e,a,l,s&&s.length>1?[i.poses[0],...s.slice(1)]:void 0,!0),c&&(r.land=c,r.landFrom=VC(r,l),r.start+r.ms-l<150&&(r.landSince=l),this.startEase(e,this.drawnNow(e,l),l,!0)),this.avoid?.ids.has(e.id)&&this.avoidSlide(e,a),i.found(a),this.stage.needsRender=!0}closeOpenSlide(){let e=this.sliding,t=e?.slide?.open;e&&t&&(t.seq===0&&(t.seq=-1),this.slideFound(e,t.seq,null))}setBends(e){Object.assign(this.stack.bends,e),this.settle()}takeOff(e){this.stack.takeOff(e),this.stage.scene.remove(e.mesh),this.stage.contactScene.remove(e.foot),this.stage.shadowsChanged()}carryOnTop(e){let t=this.stack.settled&&this.settleQueued===null&&!this.sliding;this.stack.push(e),t?(this.stack.carryOn(e),this.queueSettle(`top`)):this.queueSettle(`all`)}build(e,t,n,r,i){let a=this.piece(e,t,n,r,i);return this.dress(a),a}piece(e,t,n,r,i){let a=this.assetOf(e,i),{w:o,h:s,k:c}=this.stack.frameOf(e,a);$[e].shape&&this.shapeOf(e,a,o,s);let l=a.frame,u=this.stack.piece(e,i,a,t,n,r);return Object.assign(u,{slide:null,halfObjW:l.objectW/2*c,halfObjH:l.objectH/2*c,shake:0,slid:0})}dress(e){let t=e.type,n=$[t],r=e.asset,{w:i,h:a,cx:o,cy:s}=this.stack.frameOf(t,r),c=this.photoTexture(r.img),l,u=null,d;if(n.drape){let e=new co(i,a,64,64);if(e.translate((.5-o)*i,-(.5-s)*a,0),l=new ji(e,new wo({map:c,alphaTest:.5,side:2})),l.customDepthMaterial=new To({map:c,alphaTest:.5,depthPacking:ft}),l.material.alphaToCoverage=!0,d=zw(),qw(l,d,n.wet??0,this.stage.specTint),n.rim){let e=n.edge&&r.edge?{tex:this.edgeTexture(r.edge),img:r.edge}:void 0;u=this.buildRim(r,c,i,a,o,s,n.thick/11,d,e,(n.round??0)/11)}u&&(l.add(u),l.add(Jw(e,c,d,{w:i,h:a,cx:o,cy:s},n.thick/11)))}else if(n.shape)l=this.buildShaped(t,r,c,i,a,o,s);else{let e=n.edge&&r.edge?this.edgeTexture(r.edge):null,u=new wo({map:c,alphaTest:.5});u.alphaToCoverage=!0;let d=this.discGeometry(t,r,i,a,o,s),f;if(e){f=new wo({map:e});let t=d.userData.ownColour;t&&gw(f,new dr().setRGB(t[0],t[1],t[2],pt),n.thick/11),u.shadowSide=1,f.shadowSide=1}else f=new wo({map:c}),f.color=sp(n.dim);l=new ji(d,[u,f])}n.drape||bw(l,this.stage.footUniforms),l.castShadow=!0,l.receiveShadow=!0;let f=n.dim,p=sp(f);f&&l.traverse(e=>{for(let t of[e.material].flat()){let e=t?.color;e&&e!==p&&e.multiplyScalar(f)}});let m=new co(i,a,LS,LS);m.translate((.5-o)*i,-(.5-s)*a,0),m.setAttribute(`gap`,new Kr(new Float32Array(m.getAttribute(`position`).count),1));let h=new ji(m,Xw(c));h.visible=!1,e.mesh=l,e.foot=h,e.rim=u,e.grid=d}},cT={frame:e=>void requestAnimationFrame(e),timer:(e,t)=>window.setTimeout(e,t),clear:e=>clearTimeout(e),now:()=>performance.now(),hidden:()=>document.hidden},lT=class{step;clock;quiet=0;dozing=!1;waiting=0;constructor(e,t=cT){this.step=e,this.clock=t}get asleep(){return this.dozing}tick=e=>{this.dozing&&!this.clock.hidden()?this.waiting=this.clock.timer(()=>{this.waiting=0,this.tick(this.clock.now())},100):this.clock.frame(this.tick),this.step(e)?this.wake():!this.dozing&&++this.quiet>=30&&(this.dozing=!0)};wake=()=>{this.quiet=0,this.dozing=!1,this.waiting&&(this.clock.clear(this.waiting),this.waiting=0,this.clock.frame(this.tick))}},uT=`85574354176e`,dT=1.7,fT=.045,pT=560;function mT(e,t){let n=document.createElement(`div`);n.className=t,n.hidden=!0;let r=document.createElement(`img`);return r.className=`tool-img`,r.src=l_(`knife`),r.alt=``,r.draggable=!1,n.appendChild(r),e.appendChild(n),n}var hT=class{knife;lumps;el;lumpImg;anim=null;constructor(e,t,n){this.knife=t,this.lumps=n,this.el=mT(e,`dip-knife`),this.lumpImg=document.createElement(`img`),this.lumpImg.className=`dip-lump`,this.lumpImg.alt=``,this.lumpImg.draggable=!1,this.el.appendChild(this.lumpImg);for(let e of n.keys())new Image().src=l_(`lump-${e}-1`)}play(e,t,n){let r=this.knife,i=this.el.parentElement.getBoundingClientRect(),a=e.getBoundingClientRect(),o=a.width/t.objectW*dT,s=r.frameW*o,c=r.frameH*o,l=(r.objectX-r.frameX)*o,u=(r.objectY-r.frameY+r.objectH/2)*o,d=a.left-i.left+a.width/2,f=a.top-i.top+a.height/2;Object.assign(this.el.style,{width:`${s}px`,height:`${c}px`,left:`${d-l}px`,top:`${f-u}px`,transformOrigin:`${l}px ${u}px`});let p=this.lumps.get(n);if(p){let e=p.frame,t=p.scale,i=r.objectX+fT*r.objectW-(e.objectX-e.frameX)*t,a=e.objectY+e.objectH/2,s=a-(a-e.frameY)*t;this.lumpImg.src=l_(`lump-${n}-1`),Object.assign(this.lumpImg.style,{left:`${(i-r.frameX)*o}px`,top:`${(s-r.frameY)*o}px`,width:`${e.frameW*t*o}px`,height:`${e.frameH*t*o}px`})}this.anim?.cancel(),this.el.hidden=!1;let m={x:s*.35,y:-c*1.6};this.anim=this.el.animate([{transform:`translate(${m.x}px, ${m.y}px) rotate(-14deg) scale(1.06)`,opacity:0,offset:0},{transform:`translate(0, 0) rotate(-6deg) scale(1)`,opacity:1,offset:.3,easing:`ease-in`},{transform:`translate(0, 3px) rotate(-6deg) scale(0.93)`,opacity:1,offset:.48},{transform:`translate(0, 0) rotate(-8deg) scale(1)`,opacity:1,offset:.62,easing:`ease-in`},{transform:`translate(${m.x*.9}px, ${m.y}px) rotate(-16deg) scale(1.07)`,opacity:0,offset:1}],{duration:pT,easing:`ease-out`}),this.lumpImg.animate([{opacity:0,offset:0},{opacity:0,offset:.46},{opacity:1,offset:.56},{opacity:1,offset:1}],{duration:pT,fill:`both`}),this.anim.onfinish=()=>{this.el.hidden=!0,this.anim=null}}},gT=`./sounds/theme-1.mp3`,_T=`stullen.musik`,vT=gT,yT=[`loadedmetadata`,`play`,`playing`,`timeupdate`,`waiting`,`pause`,`error`],bT=[`pointerdown`,`pointerup`,`touchend`,`click`,`keydown`],xT=14,ST=class{parts;player=null;wanted=!1;sounding=!1;began=!1;from=0;away=!1;last=null;armed=!1;shown=null;log=[];constructor(e){this.parts=e}get state(){return this.wanted?this.sounding?`spielt`:`wartet`:`aus`}begin(e=!0){this.away=!e;let t=r(_T,`session`);if(t&&typeof t==`object`&&`at`in t){let e=Number(t.at);this.from=Number.isFinite(e)&&e>0?e:0,this.wanted=!0,this.note(`gemerkt`),this.start()}this.sync()}tap(){let e=this.player;this.note(`Tipp`),this.wanted&&e&&!e.paused?(this.off(),e.pause()):(this.wanted=!0,this.start(),this.keep()),this.sync()}keep(){this.wanted&&u(_T,{at:this.place()},`session`)}leave(){this.keep(),this.hold(`geht`)}seen(e){if(!e)return this.hold(`außer Sicht`);this.away=!1,this.wanted&&(this.note(`in Sicht`),this.start(),this.sync())}hold(e){this.away=!0,this.wanted&&(this.note(e),this.sounding=!1,this.player?.pause(),this.sync())}says(){let e=this.player,t=e?`Element ${e.paused?`hält`:`läuft`} bei ${e.currentTime.toFixed(1)} s`:`kein Element`,n=this.log.map(e=>`${e.what} ${(e.at/1e3).toFixed(1)}`).join(`, `);return`${this.state} · ${t}${this.away?` · außer Sicht`:``}${n?` · ${n}`:``}`}place(){return this.began&&this.player?this.player.currentTime:this.from}note(e){let t=this.log.at(-1);t&&t.what.replace(/ ×\d+$/,``)===e?t.what=`${e} ×${Number(/ ×(\d+)$/.exec(t.what)?.[1]??1)+1}`:(this.log.push({at:this.parts.now?.()??0,what:e}),this.log.length>xT&&this.log.shift())}off(){this.wanted=!1,this.sounding=!1,A(_T,null,`session`)}start(){if(this.away)return;let e=this.player??this.made();e.paused&&e.play().catch(e=>this.note(`abgelehnt (${e instanceof Error?e.name:`Fehler`})`))}made(){let e=this.parts.make();for(let t of yT)e.addEventListener(t,()=>this.heard(e,t));return this.player=e,this.seek(),e}seek(){let e=this.player,t=this.from;if(e&&!this.began&&t>0){e.duration>0&&Number.isFinite(e.duration)&&(t%=e.duration);try{Math.abs(e.currentTime-t)>.5&&(e.currentTime=t,this.last=null)}catch{}}}heard(e,t){if(this.note(t),t===`loadedmetadata`)return this.seek();if(t===`error`)return this.off(),this.sync();let n=this.sounding;e.paused?this.sounding=!1:t===`playing`?this.sounding=!0:t===`timeupdate`&&(this.last!==null&&e.currentTime>this.last&&(this.sounding=!0),this.last=e.currentTime),this.sounding&&(this.began=!0),n&&e.paused&&this.wanted&&!this.away&&(this.note(`von außen angehalten`),this.off()),this.sync()}sync(){let e=this.wanted&&!this.sounding;if(e!==this.armed){this.armed=e;let t=this.parts.gestures;for(let n of bT)(e?t.addEventListener:t.removeEventListener).call(t,n,this.wake,{capture:!0})}let t=this.state;t!==this.shown&&(this.shown=t,this.parts.show(t))}wake=e=>{this.parts.own(e)||this.start()}};function CT(e){let t=new ST({make:()=>{let e=new Audio(vT);return e.loop=!0,e},gestures:document,own:t=>t.target instanceof Node&&e.contains(t.target),show:t=>{e.dataset.state=t,e.setAttribute(`aria-pressed`,String(t!==`aus`))},now:()=>performance.now()}),n=()=>document.visibilityState===`visible`;return e.addEventListener(`click`,()=>t.tap()),window.addEventListener(`pagehide`,()=>t.leave()),document.addEventListener(`visibilitychange`,()=>t.seen(n())),window.addEventListener(`pageshow`,e=>{e.persisted&&t.seen(n())}),t.begin(n()),t}var wT={"aufstrich-aufnehmen":[`aufstrich-aufnehmen-1.wav`],"belag-abnehmen":[`belag-abnehmen-1.wav`],"belag-ablegen":[`belag-ablegen-1.wav`],"belag-wegnehmen":[`belag-wegnehmen.wav`]},TT=`./sounds/`,ET={"aufstrich-aufnehmen":6,"belag-abnehmen":6,"belag-ablegen":10,"belag-wegnehmen":6},DT=e=>{try{navigator.vibrate?.(e)}catch{}},OT=250,kT=class{ctx=window.AudioContext?new AudioContext:null;noise=null;cues=new Map;last=new Map;waiting=[];constructor(){let e=this.ctx;if(!e)return;let t=[`pointerdown`,`pointerup`,`touchend`,`click`,`keydown`],n=()=>this.unlock(),r=e=>{for(let r of t)(e?document.addEventListener:document.removeEventListener).call(document,r,n,{capture:!0})};r(!0),e.addEventListener(`statechange`,()=>{if(r(e.state!==`running`),e.state!==`running`)return;let t=performance.now(),n=this.waiting.filter(e=>t-e.at<=OT);this.waiting=[];for(let e of n)e.start()})}whenRunning(e,t){if(e.state===`running`)return t();let n=performance.now();this.waiting=this.waiting.filter(e=>n-e.at<=OT),this.waiting.push({start:t,at:n})}load(){let e=this.ctx;if(e)for(let[t,n]of Object.entries(wT))Promise.allSettled(n.map(async t=>e.decodeAudioData(await(await fetch(TT+t)).arrayBuffer()))).then(e=>this.cues.set(t,e.flatMap(e=>e.status===`fulfilled`?[e.value]:[])))}unlock(){let e=this.ctx;if(!e||e.state===`running`)return;Promise.resolve(e.resume()).catch(()=>{});let t=e.createBufferSource();t.buffer=e.createBuffer(1,1,e.sampleRate),t.connect(e.destination),t.start(0)}play(e){DT(ET[e]);let t=this.ctx,n=this.cues.get(e);if(!t||!n?.length)return;let r=this.last.get(e)??-1,i=r>=0&&n.length>1,a=Math.floor(Math.random()*(n.length-+!!i));i&&a>=r&&a++,this.last.set(e,a),this.whenRunning(t,()=>{let e=t.createBufferSource();e.buffer=n[a],e.connect(t.destination),e.start()})}shutter(){let e=this.ctx;if(DT([12,40,12]),e){if(!this.noise){let t=e.sampleRate;this.noise=e.createBuffer(1,Math.ceil(t*1.1),t);let n=this.noise.getChannelData(0),r=0;for(let e=0;e<n.length;e++)r=.86*r+.14*(Math.random()*2-1),n[e]=r*2.6}this.whenRunning(e,()=>this.clicks(e,this.noise))}}clicks(e,t){let n=e.currentTime;for(let[r,i]of[[0,.6],[.07,.4]]){let a=e.createBufferSource();a.buffer=t;let o=e.createBiquadFilter();o.type=`highpass`,o.frequency.value=1800;let s=e.createGain();s.gain.setValueAtTime(1e-4,n+r),s.gain.exponentialRampToValueAtTime(i,n+r+.002),s.gain.exponentialRampToValueAtTime(1e-4,n+r+.045),a.connect(o).connect(s).connect(e.destination),a.start(n+r,Math.random()),a.stop(n+r+.06)}}};function AT(e,t,n){let r=e.gpuBytes(n.photos()),i=e=>(e/1048576).toFixed(0);return`${r.textures} Texturen, ${i(r.pictures+r.shadow+t.gpuBytes)} MB: Fotos ${i(r.photos)}, Sim ${i(t.gpuBytes)}, Schatten ${i(r.shadow)}, übrige ${i(r.pictures-r.photos)}`}var jT=20,MT=class{data;f;cur=null;chunk=null;lx=0;ly=0;constructor(e,t){this.data=e,this.f=t}refill(e){this.data.ops.push({r:e})}begin(e,t){this.lx=Math.round(e/this.f*jT),this.ly=Math.round(t/this.f*jT),this.cur={b:[this.lx,this.ly],c:[]},this.chunk=null}spacing(e){this.cur&&(this.chunk=[Math.round(e/this.f*100)/100],this.cur.c.push(this.chunk))}point(e,t){if(!this.chunk)return;let n=Math.round(e/this.f*jT),r=Math.round(t/this.f*jT);this.chunk.push(n-this.lx,r-this.ly),this.lx=n,this.ly=r}end(){this.cur&&this.data.ops.push(this.cur),this.cur=null,this.chunk=null}},NT=(e,t)=>e/jT*t;function*PT(e,t){let n=e.n/512;for(let r of t.ops){if(`r`in r){let t=Od[r.r];t&&e.refill(t),yield;continue}let t=r.b[0],i=r.b[1];e.begin(NT(t,n),NT(i,n));for(let a of r.c){e.spacing=a[0]*n;for(let r=1;r+1<a.length;r+=2)t+=a[r],i+=a[r+1],e.moveTo(NT(t,n),NT(i,n)),yield}e.end(),yield}}function FT(e,t){let n=PT(e,t);for(;!n.next().done;);}var IT=()=>new Promise(e=>{let{port1:t,port2:n}=new MessageChannel;t.onmessage=()=>{t.close(),e()},n.postMessage(null)});async function LT(e,t,{stale:n=()=>!1,pause:r=IT,now:i=()=>performance.now()}={}){let a=PT(e,t);for(;;){let e=i()+40;do if(a.next().done)return!0;while(i()<e);if(await r(),n())return!1}}var RT=3,zT=kd.bladeWidth,BT=Math.tan(18*Math.PI/180),VT=25,HT=100,UT=40,WT=.4,GT=Math.tan(3*Math.PI/180),KT=hd(Date.now());function qT(e){KT=hd(e)}function JT(){return Math.floor(Math.random()*4294967296)}var YT=(e,t)=>e+KT()*(t-e),XT=(e,t)=>Math.floor(YT(e,t+1)),ZT=e=>KT()<e,QT=e=>e[Math.floor(KT()*e.length)];function $T(e){for(let t=e.length-1;t>0;t--){let n=Math.floor(KT()*(t+1));[e[t],e[n]]=[e[n],e[t]]}return e}var eE=[`banane`,`gummibaer`,`erdbeere`,`kiwi`],tE=[[`nutella`],[`jam`],[`butter`,`jam`],[`butter`,`nutella`],[`quark`,`jam`],[`butter`,`jam`,`quark`]],nE=[`roggenmisch`,`roggenmisch`,`graubrot`,`graubrot`,`vollkorn`,`vollkorn`,`toast`],rE=[`toast`,`toast`,`toast`,`roggenmisch`,`graubrot`,`vollkorn`],iE={butter:[`kaese`,`schinken`,`salami`,`gurke`,`tomate`,`ei`,`radieschen`,`gewuerzgurke`,`spiegelei`,`harzer`,`leberkaese`,`blutwurst`,`rotebete`,`lachs`,`senfgurke`,`fischstaebchen`,`pommes`,`chips`],quark:[`kaese`,`schinken`,`gurke`,`tomate`,`ei`,`radieschen`,`harzer`,`rotebete`,`lachs`],leberwurst:[`gewuerzgurke`,`gurke`,`radieschen`,`ei`,`senfgurke`]},aE={kaese:{n:[1,2],lay:[`middle`],tier:0,main:2},schinken:{n:[1,2],lay:[`middle`],tier:0,main:2},salami:{cover:[1,1.5],max:12,lay:[`ring`,`row`,`spread`],tier:1,main:2},gurke:{cover:[.9,1.4],max:9,lay:[`row`,`row`,`ring`,`spread`],tier:1,main:2},tomate:{cover:[.8,1.2],max:5,lay:[`row`,`spread`],tier:1,main:2},gewuerzgurke:{cover:[.5,.8],max:5,lay:[`parallel`,`row`],tier:1,main:1},ei:{cover:[.7,1.1],max:8,lay:[`row`,`spread`,`ring`],tier:2,main:2},radieschen:{cover:[.7,1.1],max:16,lay:[`row`,`ring`,`spread`],tier:2,main:2},spiegelei:{n:[1,1],lay:[`middle`],tier:2,main:1},banane:{cover:[.6,.95],max:14,lay:[`spread`,`row`,`ring`],tier:1,main:3},gummibaer:{cover:[.15,.25],max:24,lay:[`spread`,`spread`,`ring`],tier:2,main:2},harzer:{cover:[.6,.9],max:6,lay:[`row`,`spread`],tier:1,main:1},leberkaese:{n:[1,1],lay:[`middle`],tier:0,main:1},blutwurst:{cover:[.8,1.2],max:8,lay:[`row`,`ring`,`spread`],tier:1,main:1},rotebete:{cover:[.7,1.1],max:5,lay:[`row`,`spread`],tier:1,main:1},lachs:{n:[1,2],lay:[`middle`],tier:0,main:1},senfgurke:{cover:[.4,.6],max:6,lay:[`parallel`,`row`,`spread`],tier:2,main:1},erdbeere:{cover:[.6,.9],max:14,lay:[`spread`,`ring`],tier:1,main:3},fischstaebchen:{cover:[.5,.8],max:4,lay:[`parallel`],tier:1,main:1},pommes:{cover:[.5,.8],max:10,lay:[`parallel`,`spread`,`pile`],tier:2,main:1},chips:{cover:[.6,.9],max:7,lay:[`pile`,`spread`],tier:2,main:1},kiwi:{cover:[.7,1.1],max:6,lay:[`row`,`spread`],tier:1,main:2}};function oE(e,t,n){let r=aE[e];if(r.n)return{type:e,count:XT(...r.n),stack:n,lay:`middle`};let i=QT(r.lay);return{type:e,cover:YT(...r.cover)*t,stack:n||i===`pile`,lay:i}}var sE=.7,cE=e=>!$[e].drape&&$[e].thick>=sE,lE=e=>aE[e].tier===0,uE=e=>e.sort((e,t)=>e.t-t.t).map(({l:e})=>e),dE=e=>({l:{...e,stack:!0},t:1.5}),fE={kaese:[`gurke`,`tomate`,`radieschen`],schinken:[`ei`,`gurke`,`gewuerzgurke`],leberkaese:[`gewuerzgurke`,`senfgurke`,`ei`],lachs:[`gurke`,`ei`,`radieschen`],spiegelei:[`schinken`,`tomate`]},pE=.3,mE=.25,hE=.3;function gE(){if(ZT(.3)){let e=$T(eE.slice()).slice(0,XT(1,2)),t=e.map(t=>oE(t,e.length===1?1:YT(.6,.8),!1));return{bread:QT(rE),spreads:QT(tE),layers:t.sort((e,t)=>aE[e.type].tier-aE[t.type].tier)}}let e=QT([`butter`,`butter`,`butter`,`quark`,`leberwurst`]),t=iE[e],n=KT(),r;if(n<pE)r=uE($T(t.slice()).slice(0,XT(3,4)).map(e=>{let t=oE(e,YT(.5,.65),ZT(.75));return lE(e)?ZT(.45)?dE(t):{l:{...t,stack:!1,peek:!0},t:0}:{l:t,t:1+Math.max(0,1-$[e].cm/10)*.9+KT()*.05}}));else if(n<.55){let e=$T(t.filter(cE)),n=$T(t.filter(e=>!cE(e)&&!aE[e].n)),i=ZT(.3)?t.filter(lE):[],a=n.slice(0,e.length?XT(2,3):3).sort((e,t)=>aE[e].tier-aE[t].tier||$[t].cm-$[e].cm),o=e=>{let t=oE(e,YT(.55,.75),!1);return t.lay===`pile`?{...t,lay:`spread`,stack:!1}:t},s=Math.ceil(a.length/2),c=a.slice(0,s).map(o),l=a.slice(s).map(o);r=[...i.length?[oE(QT(i),1,!1)]:[],...c,...e.slice(0,1).map(o),...l]}else{let e=$T(t.slice()).slice(0,ZT(mE)?1:2),n=e.length===1?(fE[e[0]]??[]).filter(e=>t.includes(e)):[];n.length&&e.push(QT(n)),r=uE(e.map(t=>{let n=oE(t,e.length===1?1:YT(.6,.8),ZT(.15));return lE(t)&&ZT(.15)?dE(n):{l:n,t:aE[t].tier+KT()*.1}}))}if(n>=pE&&ZT(hE)){let e=r.filter(e=>$[e.type].drape);e.length&&(QT(e).hang=!0)}return{bread:QT(nE),spreads:[e],layers:r}}var _E=30,vE=5e3,yE=()=>({left:[],mains:[],recent:[]});function bE(){return Object.entries(aE).flatMap(([e,t])=>Array(t.main).fill(e))}var xE=e=>[...new Set(e.layers.map(e=>e.type))];function SE(e,t){let n=e.left.filter(e=>e in aE),r=e.mains.slice(0,4),i=e=>!r.includes(e);n.some(i)||n.push(...bE());let a=n.filter(i),o=a[Math.floor(t()/4294967296*a.length)];n.splice(n.indexOf(o),1);let s=e.recent.slice(0,3),c=e=>s.reduce((t,n,r)=>t+e.filter(e=>e!==o&&n.includes(e)).length*(3-r),0),l=null,u={seed:0,kinds:[]};for(let e=0,n=0;e<vE&&n<_E;e++){let e=t();if(qT(e),u={seed:e,kinds:xE(gE())},!u.kinds.includes(o))continue;n++;let r=c(u.kinds);if((!l||r<l.s)&&(l={...u,s:r}),r===0)break}let d=l??u;return{seed:d.seed,memory:{left:n,mains:[o,...r].slice(0,4),recent:[d.kinds,...s].slice(0,3)}}}var CE=`stullen.zufall`;function wE(){let e=e=>Array.isArray(e)?e.filter(e=>typeof e==`string`):[],t=r(CE);return!t||typeof t!=`object`?yE():{left:e(t.left),mains:e(t.mains),recent:Array.isArray(t.recent)?t.recent.map(e):[]}}function TE(e){u(CE,e)}function EE(e,t,n,r,i){let a=Math.hypot(r-t,i-n),o=-(i-n)/a,s=(r-t)/a,c=YT(1,5),l=YT(0,Math.PI*2),u=YT(-8,8);e.begin(t,n),e.spacing(kd.stampSpacing);for(let d=RT;d<=a;d+=RT){let f=d/a,p=Math.sin(l+f*Math.PI*1.6)*c+u*4*f*(1-f);e.point(t+(r-t)*f+o*p,n+(i-n)*f+s*p)}e.end()}function DE(e,t,n){let r=0;return(i,a,o,s)=>{Math.hypot(o-i,s-a)<20||(n>0&&r%n===0&&e.refill(t),r++,EE(e,i,a,o,s))}}function OE(e,t,n,r){let i=Math.cos(t),a=Math.sin(t),o=-a,s=i,c=1/0,l=-1/0;for(let[t,n]of e.pts){let e=(t-256)*o+(n-256)*s;c=Math.min(c,e),l=Math.max(l,e)}if(c>l)return;let u=zT*YT(.6,.8),d=l-c-zT*.7-n*2,f=Math.max(1,Math.ceil(d/u)+1),p=(c+l)/2-(f-1)*u/2,m=ZT(.5);for(let t=0;t<f;t++){let c=p+t*u+YT(-6,6),l=1/0,d=-1/0;for(let t=-512;t<=512;t+=2)e.inside(256+t*i+c*o,256+t*a+c*s)&&(l=Math.min(l,t),d=Math.max(d,t));if(d-l<30)continue;let f=l+n+YT(4,14),h=d-n+YT(-4,10);m&&t%2==1&&([f,h]=[h,f]),r(256+f*i+c*o,256+f*a+c*s,256+h*i+c*o,256+h*a+c*s)}}function kE(e,t,n){if(e.pts.length===0)return;let r=YT(-15,15),i=YT(-15,15);for(let[t,n]of e.pts)r+=t/e.pts.length,i+=n/e.pts.length;let a=XT(12,16),o=YT(0,Math.PI*2);for(let s=0;s<a;s++){let c=o+s/a*Math.PI*2+YT(-.15,.15),l=Math.cos(c),u=Math.sin(c),d=0;for(;d<512&&e.inside(r+l*d,i+u*d);)d+=2;let f=YT(5,30),p=d-t+YT(-6,8);n(r+l*f,i+u*f,r+l*p,i+u*p)}}function AE(e,t){let n=(e,n)=>t(e/512-.5,.5-n/512),r=[];for(let e=0;e<512;e+=4)for(let t=0;t<512;t+=4)n(t,e)&&r.push([t,e]);let i={inside:n,pts:r},a=b(),o=new MT(a,1);for(let t of e.spreads){let e=QT([1,2,2,2,3,3]),n=ZT(.7)?0:YT(5,25),r=YT(0,Math.PI);ZT(.3)?kE(i,n,DE(o,t,e)):OE(i,r,n,DE(o,t,e)),ZT(.45)&&OE(i,r+Math.PI/2+YT(-.3,.3),n,DE(o,t,0))}return a.ops}var jE=30,ME=.004,NE=.003,PE=5,FE=[.55,.8],IE=.12,LE=.4,RE=1.6;function zE(e,t,n){let r=[],i=new Float32Array(16384),a=new Uint8Array(16384),o=xE(e),s=new Int8Array(16384).fill(-1),c=[];for(let e=0;e<i.length;e++)t(f_(e),p_(e))?c.push(e):i[e]=-1/0;if(c.length===0)return r;let l=()=>{let e=QT(c);return[f_(e)+YT(-.5,.5)/128,p_(e)+YT(-.5,.5)/128]},u=0,d=0,f=1/0,p=-1/0,m=1/0,h=-1/0;for(let e of c){let t=f_(e),n=p_(e);u+=t,d+=n,f=Math.min(f,t),p=Math.max(p,t),m=Math.min(m,n),h=Math.max(h,n)}u/=c.length,d/=c.length;let g=h-m>=p-f?Math.PI/2:0,_=(e,t,n)=>{let r=Math.sqrt(KT())*n,i=YT(0,Math.PI*2);return[e+Math.cos(i)*r,t+Math.sin(i)*r]},[v,y]=_(u,d,.06),b=(e,t,n,r,i)=>({x:e+Math.cos(n)*r,y:t+Math.sin(n)*r,rot:i}),x=(e,n,r)=>{let i=Math.cos(r)/128,a=Math.sin(r)/128,o=0,s=0;for(;o<128&&t(e-i*(o+1),n-a*(o+1));)o++;for(;s<128&&t(e+i*(s+1),n+a*(s+1));)s++;return[o/128,s/128]},S=new Map,C=(e,t)=>{let r=`${e} ${t}`,i=S.get(r);return i||S.set(r,i=n(e,u,d,t).cells),i},w=(e,t,n)=>{let r=C(e,t),i=1/0,a=-1/0;for(let e of r){let t=f_(e)*Math.cos(n)+p_(e)*Math.sin(n);i=Math.min(i,t),a=Math.max(a,t)}return r.length?a-i+1/128:0},T=(e,t)=>{let n=C(e,t),r=0,i=0;for(let e of n)r+=f_(e)/n.length,i+=p_(e)/n.length;let a=0,o=0,s=0;for(let e of n){let t=f_(e)-r,n=p_(e)-i;a+=t*t,o+=n*n,s+=t*n}let c=Math.sqrt((a-o)**2+4*s*s);return{angle:.5*Math.atan2(2*s,a-o),long:Math.sqrt((a+o+c)/Math.max(1e-12,a+o-c))}},E=(e,n,r)=>{for(let[i,a]of om)if(!t(e+i*r,n+a*r))return!1;return t(e,n)};function D(e,t){let n=e.type,i=T(n,0),a=(e=>e-Math.PI*Math.round(e/Math.PI))(T(n,.3).angle-i.angle)>=0?1:-1,o=i.long>RE,s=e=>(e-i.angle)*a,c=w(n,s(0),0),f=w(n,s(0),Math.PI/2),p=[];if(e.stack){let e=(o?f:c)*YT(.2,.35),n=YT(0,Math.PI*2);for(let r=0;r<t;r++){let i=n+r/t*Math.PI*2;p.push(b(v,y,i,e,o?s(g+YT(-.25,.25)):void 0))}return p}switch(e.lay){case`row`:{let e=QT([g,g,g+Math.PI/4,g-Math.PI/4,g+Math.PI/2])+YT(-.12,.12),r=o?s(e+Math.PI/2):void 0,i=w(n,r??0,e),a=$[n].thick/11>IE*i,c=i*(a?YT(.95,1.05):YT(...FE)),l=i*(a?.9:.4),f=w(n,r??0,e+Math.PI/2),m=f*YT(.75,.9),[h,_]=x(u,d,e+Math.PI/2),v=Math.max(1,Math.floor((h+_-f*.9)/m)+1),y=Math.cos(e),b=Math.sin(e),S=ZT(.5),C=1,T=t=>{let n=(t-(C-1)/2)*m,r=u-b*n,a=d+y*n,[o,s]=x(r,a,e);return{cx:r,cy:a,room:Math.max(0,o+s-i*.95),mid:(s-o)/2}},E=e=>Array.from({length:C},(t,n)=>Math.floor(T(n).room/e)+1).reduce((e,t)=>e+t,0);for(;C<v&&E(c)<t;)C++;let D=Math.min(t,E(l));for(let e=0;e<C&&D>0;e++){let{cx:t,cy:n,room:i,mid:a}=T(e),o=Math.min(Math.floor(i/l)+1,Math.ceil(D/(C-e)));D-=o;let s=o>1?Math.min(c,i/(o-1)):c;for(let e=0;e<o;e++){let i=a+(S?(o-1)/2-e:e-(o-1)/2)*s;p.push({x:t+y*i,y:n+b*i,rot:r===void 0?void 0:r+YT(-.06,.06)})}}return p}case`ring`:{let n=Math.min(...[0,1,2,3].map(e=>Math.min(...x(u,d,e*Math.PI/4))))-c*.5,r=c*YT(...FE),i=Math.min(n,t*r/(Math.PI*2));if(i<c*.4)return D({...e,lay:`spread`},t);let a=YT(0,Math.PI*2),l=Math.min(t,Math.max(3,Math.floor(Math.PI*2*i/r))),f=0;for(;f<t&&i>=c*.3;){for(let e=0;e<l&&f+e<t;e++){let t=a+e/l*Math.PI*2;p.push(b(u,d,t,i,o?s(t+Math.PI/2):void 0))}f+=l,i-=c*.75,l=Math.max(1,Math.floor(Math.PI*2*i/r))}return f<t&&p.push({x:u,y:d}),p}case`parallel`:{let e=s(g+YT(-.1,.1)),r=w(n,e,g),i=w(n,e,g+Math.PI/2),a=i*YT(1.1,1.5),[o,c]=x(u,d,g+Math.PI/2),[l,f]=x(u,d,g),m=Math.max(1,Math.floor((o+c-i*1.2)/a)+1),h=Math.max(1,Math.min(Math.ceil(t/m),Math.floor((l+f)/(r*1.05)))),_=Math.cos(g),v=Math.sin(g),y=Math.min(t,m*h);for(let t=0;t<h;t++){let n=Math.ceil(y/(h-t));y-=n;let i=(t-(h-1)/2)*r*1.05+YT(-.02,.02);for(let t=0;t<n;t++){let r=(t-(n-1)/2)*a;p.push({x:u+_*i-v*r,y:d+v*i+_*r,rot:e+YT(-.05,.05)})}}return p}case`pile`:for(let e=0;e<t;e++){let[e,t]=_(v,y,c*.35);p.push({x:e,y:t})}return p;case`spread`:{let e=r.map(e=>[e.x,e.y]);for(let n=0;n<t;n++){let t=null,n=-1;for(let r=0;r<30;r++){let[i,a]=l();if(r<20&&!E(i,a,Math.min(c,f)*.4))continue;let o=1/0;for(let[t,n]of e)o=Math.min(o,Math.hypot(i-t,a-n));o>n&&([t,n]=[[i,a],o])}t&&(e.push(t),p.push({x:t[0],y:t[1]}))}return p}default:return p}}let O=f=>{for(let p of e.layers){let e=$[p.type];if(!e)continue;let m=o.indexOf(p.type),h=e.thick/11,g=e.cm/11,S=e.drape&&(e.stiff??0)<.5,w=p.count??(p.cover===void 0?1:Math.max(1,Math.min(aE[p.type]?.max??12,Math.round(p.cover*c.length/Math.max(1,C(p.type,0).length))))),T=p.lay&&p.lay!==`middle`?D(p,w):[],E=T.length||w;p.peek&&(T[0]=b(v,y,YT(0,Math.PI*2),g*.22));let O=p.hang?Math.max(0,T.length-1):-1;if(O>=0){let e=T[O],t=e&&Math.hypot(e.x-u,e.y-d)>.02?Math.atan2(e.y-d,e.x-u):YT(0,Math.PI*2);t+=YT(-.2,.2);let[,n]=x(u,d,t);T[O]=b(u,d,t,n-g*YT(.2,.32),e?.rot)}for(let o=0;o<E;o++){let c=T[o],b=p.stack&&!S&&ZT(WT),x=e.vary?XT(0,23):void 0,C=null,w=(r,o,c,l,u)=>{if(!t(r,o))return!1;let{cells:d,com:_,top:v,bot:y}=n(p.type,r,o,c,x),w=d.length;if(w===0)return!1;let T=0;for(let e of d)i[e]===-1/0&&T++;let E,D,O=null,k=!1;if(S){if(T>w*(u??f*(e.stiff===0?.1:.06)))return!1;D=0;for(let e of d)D=Math.max(D,i[e]);E=p.stack?D:-D}else{if(T>w*(u??f*.08))return!1;let[e,t]=_,n=j_(d,i,e,t,void 0,y);if(D=n.h,u===null&&D<=1e-9&&T>w*f*.04)return!1;let r=Math.hypot(n.ax,n.ay);if(n.capped||r>BT)return!1;let o=.15*h+.001,c=[],l=1/0,v=0;for(let r=0;r<w;r++){let u=d[r];i[u]!==-1/0&&Cm(n,e,t,f_(u),p_(u))+(y?y[r]:0)-i[u]<=o&&(c.push([f_(u),p_(u)]),l=Math.min(l,a[u]),s[u]===m&&v++)}if(c.length===0&&(l=0),l>2||l>=1&&v>c.length/2||c.length<w-T&&!xm(ym(c),e,t,g*.06))return!1;O={pose:n,com:_,tier:l},E=p.stack?D+c.length/w/128:-D,k=b&&r>GT}return l&&(E=(p.stack?E:0)-Math.hypot(r-l.x,o-l.y)),E+=YT(0,.3/128),(!C||k&&!C.leans||k===C.leans&&E>C.score)&&(C={x:r,y:o,rot:c,cells:d,top:v,base:D,rest:O,leans:k,score:E}),!0},E=!1;if(c)for(let e=0;e<jE&&!E;e++){let t=YT(-Math.PI,Math.PI),[n,r]=_(c.x,c.y,ME+e*NE);c.rot!==void 0&&(t=c.rot+YT(-.05,.05)*(1+e*.2)),E=w(n,r,t,c,o===O?LE:null)&&e>=PE}for(let t=0;t<(p.stack?HT:50)&&!E;t++){let n=YT(-Math.PI,Math.PI),r,i;S&&e.stiff!==0?[r,i]=_(u,d,.12):p.stack&&t<VT?[r,i]=_(v,y,g*.3+.12):[r,i]=l(),w(r,i,n,null,null)&&(E=p.stack?t>=UT:C.base<=1e-9&&t>8)}if(C){r.push({type:p.type,x:C.x,y:C.y,rot:C.rot,...x===void 0?{}:{v:x}});for(let e of C.cells)s[e]=m;if(C.rest){let{pose:e,com:t,tier:n}=C.rest;R_(C.cells,i,e,t[0],t[1],C.top?C.top():wm(h,e.ax,e.ay));for(let e of C.cells)a[e]<=n&&(a[e]=n+1)}else{let e=i.slice();for(let t of C.cells){if(e[t]===-1/0)continue;let n=t%128,r=Math.floor(t/128),a=0;for(let t=-2;t<=2;t++)for(let i=-2;i<=2;i++){let o=n+i,s=r+t;o<0||s<0||o>=128||s>=128||(a=Math.max(a,e[s*128+o]-.15*h*Math.hypot(i,t)))}i[t]=a+h}}}}}};return O(1),r.length===0&&O(3),r}var BE={spread:{touch:`Spread with your finger`,mouse:`Spread with the mouse`,ms:0},turn:{touch:`Turn it by the handle`,mouse:`Turn it by the handle or with the mouse wheel`,ms:4e3},pull:{touch:`You can drag it onto the bread too`,ms:4e3},rock:{touch:`If it wobbles, it slides off`,ms:4e3},camera:{touch:`Drag to look around`,ms:0}};function VE(e,t){return t.has(e)?null:BE[e]}var HE=`stullen.coach`;function UE(){let e=r(HE);return new Set(Array.isArray(e)?e.filter(e=>e in BE):[])}function WE(e){u(HE,[...e])}var GE=.25,KE=1900,qE=class{knife;el;anim=null;constructor(e,t){this.knife=t,this.el=mT(e,`ghost-knife`)}play(e,t,n){let r=this.knife,i=this.el.parentElement.getBoundingClientRect(),a=n/r.objectW,o=(r.objectX-r.frameX+GE*r.objectW)*a,s=(r.objectY-r.frameY+r.objectH/2)*a;Object.assign(this.el.style,{width:`${r.frameW*a}px`,height:`${r.frameH*a}px`,left:`${e[0]-i.left-o}px`,top:`${e[1]-i.top-s}px`});let c=t[0]-e[0],l=t[1]-e[1];this.anim?.cancel(),this.el.hidden=!1,this.anim=this.el.animate([{transform:`translate(${-c*.08}px, ${-l*.08}px) scale(1.04)`,opacity:0,offset:0},{transform:`translate(0, 0) scale(1)`,opacity:.8,offset:.18,easing:`ease-in-out`},{transform:`translate(${c}px, ${l}px) scale(1)`,opacity:.8,offset:.82},{transform:`translate(${c*1.08}px, ${l*1.08}px) scale(1.04)`,opacity:0,offset:1}],{duration:KE,easing:`ease-out`}),this.anim.onfinish=()=>this.stop()}stop(){this.anim?.cancel(),this.anim=null,this.el.hidden=!0}},JE=new Intl.NumberFormat(`de-DE`),YE=e=>JE.format(e),XE=e=>`No. ${YE(e)}`,ZE=e=>`Sandwich ${XE(e)}`,QE={kaese:{noun:`cheese`},salami:{noun:`salami`},schinken:{noun:`ham`},gurke:{noun:`cucumber`},tomate:{noun:`tomato`},ei:{noun:`egg`},radieschen:{noun:`radish`},gewuerzgurke:{noun:`gherkin`},leberkaese:{noun:`meat loaf`},harzer:{noun:`cheese`},blutwurst:{noun:`black pudding`},spiegelei:{noun:`fried egg`},rotebete:{noun:`beetroot`},senfgurke:{noun:`pickle`},lachs:{noun:`salmon`},bismarckhering:{noun:`herring`},schnittlauch:{noun:`chives`,loose:!0},banane:{noun:`banana`},erdbeere:{noun:`strawberry`},kiwi:{noun:`kiwi`},fischstaebchen:{noun:`fish finger`},pommes:{noun:`chips`,loose:!0},chips:{noun:`crisp`},marshmallow:{noun:`marshmallow`},schokolinse:{noun:`chocolate button`},gummibaer:{noun:`gummy bear`},deckeltoast:{noun:`top slice`},deckelroggenmisch:{noun:`top slice`},deckelgraubrot:{noun:`top slice`},deckelvollkorn:{noun:`top slice`}},$E=[``,``,`two`,`three`,`four`,`five`,`six`,`seven`,`eight`,`nine`,`ten`,`eleven`,`twelve`],eD={};function tD(e,t=1/0){let n=[E.find(t=>t.id===e.bread)?.full??`Bread`],r=[],i=`butter`;for(let t of e.ops)`r`in t?i=t.r:r.includes(i)||r.push(i);for(let e of r)n.push((n_[e]??e).toLowerCase());let a=new Map;for(let t of e.toppings)QE[t.type]&&a.set(t.type,(a.get(t.type)??0)+1);for(let[e,c]of a){let q=QE[e];n.push(q.loose?q.noun:c===1?`a ${q.noun}`:`${$E[c]??c} ${q.noun}s`)}let o=n.length>t,l=n.slice(0,t);return l.length<2?l.join(``)+(o?` and more`:``):o?`${l.join(`, `)} and more`:`${l.slice(0,-1).join(`, `)} and ${l.at(-1)}`}var nD=.42;function rD(e){let t=e.height*D.w/D.h;return{left:e.left+e.width/2-nD*t,top:e.top,width:t,height:e.height}}var iD=47,aD={padX:.6,padY:.38,margin:1,alpha:.88};function oD(){let e=getComputedStyle(document.documentElement),t=(t,n)=>e.getPropertyValue(t).trim()||n;return{font:`600 ${iD}px ${t(`--mono`,`monospace`)}`,plate:t(`--table`,`#1f150d`),ink:t(`--ink-bright`,`#fbf6e3`)}}var sD=null;function cD(){return sD??=document.fonts.load(oD().font).catch(()=>{}),sD}function lD(e,t){let n=iD,r=fD(e,e.width,e.height),i=r.getContext(`2d`),a=XE(t),o=oD();i.font=o.font;let s=Math.round(n*aD.padX),c=Math.round(n*aD.padY),l=Math.ceil(i.measureText(a).width)+2*s,u=n+2*c,d=r.width-n*aD.margin-l,f=r.height-n*aD.margin-u;return i.globalAlpha=aD.alpha,i.fillStyle=o.plate,i.fillRect(d,f,l,u),i.globalAlpha=1,i.fillStyle=o.ink,i.textBaseline=`middle`,i.fillText(a,d+s,f+u/2+n*.04),r}async function uD(e,t){await cD();let n=lD(e,t);try{return await pD(n)}finally{nf(n)}}async function dD(e){let t=[],r=e;for(;r.width/2>=n.w;)r=fD(r,r.width/2,r.height/2),t.push(r);let i=fD(r,n.w,n.h);t.push(i);try{return await pD(i)}finally{t.forEach(nf)}}function fD(e,t,n){let r=document.createElement(`canvas`);r.width=Math.round(t),r.height=Math.round(n);let i=r.getContext(`2d`);return i.imageSmoothingEnabled=!0,i.imageSmoothingQuality=`high`,i.drawImage(e,0,0,r.width,r.height),r}function pD(e){return new Promise((t,n)=>e.toBlob(e=>e?t(e):n(Error(`JPEG encoding failed`)),`image/jpeg`,.85))}var mD=`Washing hands …`,hD=`Getting the toppings ready …`,gD=`Wiping the knife …`,_D={kaese:`Slicing the cheese …`,salami:`Slicing the salami …`,schinken:`Peeling the ham off the paper …`,gurke:`Slicing the cucumber …`,tomate:`Slicing the tomato …`,ei:`Peeling the egg …`,radieschen:`Washing the radishes …`,gewuerzgurke:`Fishing a gherkin out of the jar …`,leberkaese:`Warming the meat loaf …`,harzer:`Unwrapping the cheese …`,blutwurst:`Peeling the black pudding …`,spiegelei:`Frying the egg …`,rotebete:`Getting beetroot out of the jar …`,senfgurke:`Draining the pickle …`,lachs:`Laying out the salmon …`,bismarckhering:`Lifting the herring out of the jar …`,schnittlauch:`Chopping the chives …`,banane:`Peeling the banana …`,erdbeere:`Washing the strawberries …`,kiwi:`Peeling the kiwi …`,fischstaebchen:`Frying the fish fingers …`,pommes:`Salting the chips …`,chips:`Opening the crisps …`,marshmallow:`Getting the marshmallows …`,schokolinse:`Counting the chocolate buttons …`,gummibaer:`Sorting the gummy bears by colour …`,deckeltoast:`Cutting the top slice …`,deckelroggenmisch:`Cutting the top slice …`,deckelgraubrot:`Cutting the top slice …`,deckelvollkorn:`Cutting the top slice …`};function vD(e){return e===`toast`?`Taking the toast out of the bag …`:`Cutting the bread …`}var yD=class{show;timer;done=!1;constructor(e){this.show=e}step(e){this.done||(clearTimeout(this.timer),this.timer=setTimeout(()=>this.show(e),600))}end(){this.done=!0,clearTimeout(this.timer)}},bD=(function(){let e=typeof document<`u`&&document.createElement(`link`).relList;return e&&e.supports&&e.supports(`modulepreload`)?`modulepreload`:`preload`})(),xD=function(e){return`/`+e},SD={},CD=function(e){return e.pathname.endsWith(`.css`)},wD=function(e,t,n){if(t in e)return e[t];let r=n();if(!r){e[t]=void 0;return}let i=r.then(()=>{e[t]=void 0},n=>{throw e[t]=void 0,n});return e[t]=i,i},TD=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e,i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?new URL(import.meta.resolve(e)):new URL(e,import.meta.url)}r=o(t.map(t=>{t=xD(t,n);let r=s(t),i=CD(r);return wD(SD,r.href,()=>{if(e===void 0){e={all:new Set,styles:new Set};let t=document.getElementsByTagName(`link`);for(let n=t.length-1;n>=0;n--){let r=t[n];e.all.add(r.href),r.rel===`stylesheet`&&e.styles.add(r.href)}}if((i?e.styles:e.all).has(r.href))return;let t=document.createElement(`link`);if(t.rel=i?`stylesheet`:bD,i||(t.as=`script`),t.crossOrigin=``,t.href=r.href,a&&t.setAttribute(`nonce`,a),document.head.appendChild(t),i)return new Promise((e,n)=>{let i=a=>{t.removeEventListener(`load`,i),t.removeEventListener(`error`,i),a.type===`error`?n(Error(`Unable to preload CSS for ${r}`)):e(a)};t.addEventListener(`load`,i),t.addEventListener(`error`,i)})})}).filter(e=>e!==void 0))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};function ED(e,t,n){let r=rf(e,t,n),i=new Uint8Array(t*n);for(let e=0;e<i.length;e++)i[e]=r[e*4];return i}var DD=`stullen.land`;function OD(e,t,n){C(e);for(let[e,r]of Object.entries(t))r===null?n.searchParams.delete(e):n.searchParams.set(e,r)}var kD=100,AD=2e4,jD=4e3,MD=2500,ND=600,PD={butter:1,jam:.88,nutella:.79,quark:1,leberwurst:.79},FD={lift:`belag-abnehmen`,place:`belag-ablegen`,remove:`belag-wegnehmen`,give:`belag-abnehmen`,stay:`belag-ablegen`},ID=1e3,LD=600,RD=3,zD=7e3,BD=3e3,VD=(e,t)=>e.length===0&&!t.some(e=>`b`in e),HD=.2,UD=65,WD=[[`Oben`,0,0],[`Schräg`,36,0],[`Flach`,60,0],[`Ecke`,46,-38]],GD=1,KD=.4,qD=.3,JD=340,YD=30,XD=e=>2*Math.tan(an.degToRad(e/2)),ZD=XD(YD),QD=.85,$D=.4,eO=.05,tO=[0,15,30,45,UD],nO=12;function rO(e,t,n){return(r,i)=>{let a=Math.floor((r+.5)*t),o=Math.floor((.5-i)*t);return a>=0&&o>=0&&a<t&&o<t&&e[o*t+a]>n}}async function iO(n){dx(`Skript läuft`);let r=document.hidden;document.addEventListener(`visibilitychange`,()=>r=!0,{once:!0});let u=n.querySelector(`.loading-word`),j=new yD(e=>u&&(u.textContent=e));j.step(mD);let L=e=>{let t=n.querySelector(e);if(!t)throw Error(`editor markup missing: ${e}`);return t},R=L(`.tray`),z=R.getAttribute(`aria-label`)??``,B=L(`.stock`),ne=L(`.shutter`),V=L(`.end-word[data-end=left]`),H=L(`.end-word[data-end=right]`),re=[V,H],ie=e=>e instanceof Node&&(B.contains(e)||re.some(t=>t.contains(e))),ae=matchMedia(`(hover: hover) and (pointer: fine)`),oe=matchMedia(`(prefers-reduced-motion: reduce)`),se=L(`.finder`),ce=L(`.sides`),le=L(`.flash`),U=L(`.hint:not(.coach)`),ue=L(`.coach`),de=L(`.sheet`),fe=L(`[data-act=new]`),W=L(`[data-act=help]`),pe=L(`#help`),me=L(`.topbar`),he=L(`.back-word`),ge=L(`.views`),_e=n.querySelector(`.debug`),ve=new kT,ye=CT(L(`[data-act=music]`)),be=new URLSearchParams(location.search);a(w);let G=_(),xe=i(DD,`session`),Se=xe===`random`||G.toppings.length===0?null:T(G.toppings.length),Ce=new Ux(uT,Se!==null),we=null,Te=null;if(xe===`random`){let e=e=>Number.isInteger(e)&&e>=0&&e<4294967296,t=Number(be.get(`seed`)),n=new URL(location.href),r;if(be.has(`seed`)&&e(t))r=t,n.searchParams.delete(`seed`);else{let e=SE(wE(),JT);TE(e.memory),r=e.seed}qT(r),Te=r,we=gE(),we.bread!==G.bread&&E.some(e=>e.id===we.bread)&&(G=b(we.bread),C(G)),n.href!==location.href&&history.replaceState(history.state,``,n),console.info(`Zufällige Stulle: seed ${r} (open ?seed=${r} and tap "Zufällige Stulle" to make it again)`)}let Ee=VD(G.toppings,G.ops),K=G.bread;Bf(E.find(e=>e.id===K).thick);let De=s_(`knife`),q=new Map,Oe=new Map,ke=e=>tf(e).catch(()=>void 0);function Ae(e){let t=Oe.get(e);if(!t){let n=$[e],r=(e,t)=>e?$d(t):Promise.resolve(void 0);t=Promise.all([ef(l_(`top-${e}`)),$d(l_(`top-${e}`,`-mask`)),r(n.edge,l_(`edge-${n.edge?.tex}`)),r(n.layers,l_(`top-${e}`,`-layers`)),r(n.shape?.kind===`round`&&n.shape.extra,l_(`top-${e}`,`-relief`)),r(n.fold,l_(`top-${e}`,`-fold`)),ke(l_(`top-${e}`,`-outline`))]).then(([t,r,i,a,o,s,c])=>px(`${e} lesen`,()=>{let l=Math.round(160*r.naturalHeight/r.naturalWidth),u=n.layers??1,d=a&&Float32Array.from(ED(a,160,l),e=>1+e/255*(u-1)),f=s&&Float32Array.from(ED(s,160,l),e=>e/255),p={frame:s_(`top-${e}`),img:t,edge:i,layers:d,relief:o,fold:f,outline:c,alpha:ED(r,160,l),aw:160,ah:l};return q.set(e,p),p})),Oe.set(e,t),t.catch(()=>Oe.get(e)===t&&Oe.delete(e))}return t}for(let e of new Set(G.toppings.map(e=>e.type)))r_.includes(e)&&Ae(e);let je=matchMedia(`(pointer: coarse)`).matches,Me=tf(`./scene/${K}.json`),Ne=Me.then(e=>$d(`./scene/${je?t(e.board,p):e.board}`)),Pe=Me.then(e=>ke(`./scene/${O(e.board)}`)),Fe=$d(`./scene/tisch.webp`);Promise.all([Ne,Fe]).then(()=>j.step(vD(K)),()=>{});let Ie=d(K,`slice`),[Le,Re,ze,Be,Ve,He,Ue,We]=await Promise.all([Me,Ne,Pe,Fe,$d(je?t(Ie,h):Ie),$d(d(K,`mask`)),$d(t(d(K,`edge`),k)),$d(d(K,`crust`))]);dx(`Szene geladen`);let Ge=Jp(be.get(`tisch`)),Ke=ED(Ue,512,512),J=px(`Bühne`,()=>new Hp(n,{placement:Le,boardImg:Re,boardOutline:ze,tableImg:Be,table:Ge,breadImg:Ve,maskBytes:Ke,edgeImg:Ue,crustImg:We,maskSize:512,bump:22})),qe=rO(Ke,512,127),Je=je?512:768,Ye=Number(be.get(`grid`)),Xe=Ye>=256&&Ye<=2048?Math.round(Ye):Je,Ze=e=>Yd.create(Float32Array.from(ED(He,e,e),e=>e/255),Ad(e),J.renderer),Qe=performance.now(),$e;try{$e=Ze(Xe)}catch(e){if(Xe===512)throw e;console.warn(`stullen: no simulation grid of ${Xe}, using 512`,e),$e=Ze(512)}if(!$e)throw Error(of);let et=$e;fx(`Simulation`,Qe);let tt=et.p,nt=et.n,rt=et.mask;J.showSim(et);let it=e=>e===`gloss`?1.5:e===`exposure`?2:1,at=Up(be.get(`look`),Yf,e=>[0,it(e)],9);J.setLook(at);let ot=rO(ED(He,512,512),512,127);we&&(G.ops=AE(we,ot));let st=performance.now(),ct=!1,lt=()=>void(ct=!0);for(J.canvas.addEventListener(`webglcontextrestored`,lt);!await LT(et,G,{stale:()=>ct});)ct=!1,et.refill(Od.butter);J.canvas.removeEventListener(`webglcontextrestored`,lt),fx(`Striche`,st),J.canvas.addEventListener(`webglcontextrestored`,()=>{et.refill(Od.butter),FT(et,G)});let ut=``;window.addEventListener(`pagehide`,e=>ut=e.persisted?`abgelegt`:`geht`),window.addEventListener(`pageshow`,()=>ut=``),J.canvas.addEventListener(`webglcontextlost`,()=>{ut!==`geht`&&I(`Kontext`,`WebGL-Kontext verloren, Seite ${ut||(document.visibilityState===`visible`?`sichtbar`:`verborgen`)}`)});let dt=new MT(G,et.f),ft=0,pt=!1,mt=!1,ht=xe!==`random`,gt=!1,_t=!1,vt=()=>{ht=!0,_t||pt||xt()||(m(),_t=!0)},yt=()=>{clearTimeout(ft),pt||!mt||xt()||(G.toppings=Y.items,y(G),S(Y.ids))},bt=()=>{clearTimeout(ft),ft=window.setTimeout(()=>{yt(),St(),kt()},300)};window.addEventListener(`pagehide`,yt);function xt(){return!gt&&l()&&(gt=!0,clearTimeout(ft)),gt}function St(){pt||!xt()||n.classList.contains(`sheet-open`)||document.visibilityState===`visible`&&document.hasFocus()&&(pt=!0,location.reload())}if(window.addEventListener(`storage`,St),window.addEventListener(`pageshow`,St),window.addEventListener(`focus`,St),document.addEventListener(`visibilitychange`,St),we)for(let e of we.layers)r_.includes(e.type)&&Ae(e.type);let Ct=Promise.allSettled(Oe.values()),wt=[...Oe.keys()],Tt=()=>{let e=_D[wt.find(e=>!q.has(e))??``];e&&j.step(e)};Tt();for(let e of Oe.values())e.then(Tt,Tt);let Et=!1,Y=new sT(J,n,q,{surfaceAt:(e,t)=>ot(e,t)?zf+et.h[Math.floor((.5-t)*nt)*nt+Math.floor((e+.5)*nt)]*J.lift:0,onBread:ot,onSlice:qe,onChange:bt,onTurn:()=>{vt(),Zn(`turn`)},onTopping:e=>{ve.play(FD[e]),e===`lift`&&(vt(),Rn=!0,zn?.abort(`strip`),Pn===`spread`&&Xn()),e===`give`&&vt(),e===`remove`&&(zt=null),e===`place`&&zt&&P(`Erster Belag`,{wie:zt}),e===`place`&&Wn(`turn`,()=>qt===`edit`&&Bn.size===0&&Pn!==`pull`&&Y.picked,()=>Y.wiggleHandle())},onTapLanded:e=>{let t=B.querySelector(`.item.top[data-top="${e}"]`);Wn(`pull`,()=>qt===`edit`,()=>t&&xx(t,`peek`))},onRock:()=>Wn(`rock`,()=>qt===`edit`&&Y.carrying),handleRoom:e=>({left:e.left,right:e.right,top:me.getBoundingClientRect().bottom,bottom:ne.getBoundingClientRect().top}),settler:Ce});Object.assign(Y.stack.bends,Up(be.get(`biege`),yv,()=>bv));let Dt,Ot=et.heightsPending?new Promise(e=>Dt=e):Promise.resolve();et.onHeights=()=>{Dt?.(),Y.settle()},J.canvas.setAttribute(`role`,`img`);function kt(){J.canvas.setAttribute(`aria-label`,`Your sandwich: ${tD({...G,toppings:mt?Y.items:G.toppings})}`)}kt();let At,jt=new Promise(e=>At=e);function Mt(){px(`Belag legen`,()=>{we&&(G.toppings=zE({...we,layers:we.layers.filter(e=>q.has(e.type))},ot,(e,t,n,r,i)=>Y.footprint(e,t,n,r,i)));let e=we?null:Se;Y.restore(G.toppings,!0,e),mt=!0,we?yt():!e&&!xt()&&S(Y.ids),kt()}),dx(`Belag liegt`),At()}ve.load();let Nt=[...B.querySelectorAll(`.item.top`)].map(e=>e.dataset.top),Pt=async()=>{for(let e=Nt.shift();e;e=Nt.shift())await Ae(e).catch(()=>{}),Y.prepare(e),Ft=Ft.then(It).then(()=>Y.warmUp(e)).catch(t=>console.warn(`stullen: ${e} not warmed`,t))},Ft=Promise.resolve(),It=()=>new Promise(e=>{if(n.classList.contains(`loading`))return void requestAnimationFrame(()=>e());let t=()=>mx(()=>Bn.size>0?window.setTimeout(t,300):e());t()}),Lt=jt.then(async()=>{j.step(hD),await Promise.all([0,1,2].map(Pt)),j.step(gD),await Ft}),Rt=!1,zt=null,Bt=e=>{for(let t of B.querySelectorAll(`.item`))t.tabIndex=t===e?0:-1};B.firstElementChild instanceof HTMLElement&&Bt(B.firstElementChild),B.addEventListener(`focusin`,e=>{let t=e.target.closest(`.item`);t&&Bt(t)}),B.addEventListener(`keydown`,e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;let t=[...B.querySelectorAll(`.item`)],n=t.indexOf(e.target.closest(`.item`)),r=e.key===`ArrowRight`?n+1:e.key===`ArrowLeft`?n-1:e.key===`Home`?0:e.key===`End`?t.length-1:-1;n<0||!t[r]||(e.preventDefault(),t[r].focus())});let Vt=e=>{let t=e=>void(e&&(zt=`getippt`));q.has(e)&&mt?t(Y.putFromStock(e)):Promise.all([Ae(e),jt]).then(()=>!Et&&qt===`edit`&&t(Y.putFromStock(e)),()=>{})};for(let e of B.querySelectorAll(`.item.top`))e.addEventListener(`touchmove`,e=>Rt&&e.preventDefault(),{passive:!1});let Ht=e=>{e.touches.length===0&&(Rt=!1)};B.addEventListener(`touchend`,Ht),B.addEventListener(`touchcancel`,Ht),B.addEventListener(`pointerdown`,e=>{if(Et)return;let t=e.target.closest(`.item.top`);if(!t||!t.dataset.top)return;Sr();let r=t.dataset.top,i=e.pointerId,a=e.clientX,o=e.clientY,s=e.pointerType===`touch`;Rt=s;let c=e=>{if(e.pointerId!==i)return;let t=e.clientX-a,c=e.clientY-o;if(Math.hypot(t,c)<10)return;let l=s?-c>Math.abs(t)*.58:c<4;if(l||(Rt=!1),u(),!l)return;let d=(e,t)=>{Zn(`pull`),zt=`gezogen`;let a=n.getBoundingClientRect().bottom-B.offsetHeight-(parseFloat(getComputedStyle(R).paddingBottom)||0);Y.dragFromStock(r,i,e,t,a-(parseFloat(getComputedStyle(R,`::before`).height)||0))};if(q.has(r)&&mt){d(e.clientX,e.clientY);return}let f=[e.clientX,e.clientY],p=!0,m=new AbortController,h=e=>{e.pointerId===i&&(p=!1)};window.addEventListener(`pointermove`,e=>e.pointerId===i&&(f=[e.clientX,e.clientY]),{signal:m.signal}),window.addEventListener(`pointerup`,h,{signal:m.signal}),window.addEventListener(`pointercancel`,h,{signal:m.signal}),Promise.all([Ae(r),jt]).then(()=>{m.abort(),p&&d(f[0],f[1])},()=>m.abort())},l=e=>{e.pointerId===i&&(u(),e.type!==`pointerup`||Et||qt!==`edit`||Vt(r))},u=()=>{window.removeEventListener(`pointermove`,c),window.removeEventListener(`pointerup`,l),window.removeEventListener(`pointercancel`,l)};window.addEventListener(`pointermove`,c),window.addEventListener(`pointerup`,l),window.addEventListener(`pointercancel`,l)}),B.addEventListener(`click`,e=>{if(e.detail!==0||Et||qt!==`edit`||n.classList.contains(`loading`))return;let t=e.target.closest(`.item.top`)?.dataset.top;t&&(Sr(),Vt(t))});let Ut=()=>{let e=B.scrollWidth-B.clientWidth;if(B.classList.toggle(`more-left`,B.scrollLeft>2),B.classList.toggle(`more-right`,B.scrollLeft<e-2),!ae.matches)return;let t=B.querySelector(`.item.top`);H.classList.toggle(`on`,B.scrollLeft<e-2),V.classList.toggle(`on`,!!t&&t.getBoundingClientRect().left<B.getBoundingClientRect().left+Gt())},Wt,Gt=()=>Wt??=parseFloat(getComputedStyle(B).getPropertyValue(`--fade`))||0;ae.addEventListener(`change`,Ut),B.addEventListener(`scroll`,Ut,{passive:!0}),new ResizeObserver(Ut).observe(B),B.addEventListener(`wheel`,e=>{if(Math.abs(e.deltaY)<=Math.abs(e.deltaX)||e.ctrlKey||B.scrollWidth<=B.clientWidth)return;let t=e.deltaMode===1?16:e.deltaMode===2?B.clientWidth:1;B.scrollLeft+=e.deltaY*t,e.preventDefault()},{passive:!1});let Kt=e=>{zn?.abort(`strip`),B.scrollTo({left:e,behavior:oe.matches?`auto`:`smooth`})};H.addEventListener(`click`,()=>Kt(B.scrollLeft+B.clientWidth*.8)),V.addEventListener(`click`,()=>Kt(0));let qt=`edit`,Jt=[0,0],Yt={left:0,top:0,width:1,height:1},Xt={cx:0,cy:0,side:1,fov:J.fov},Zt=0,Qt=QD,$t=null,en=[];for(let e=0;e<nt;e+=8)for(let t=0;t<nt;t+=8){if(rt[e*nt+t]<=.5)continue;let n=(e,t)=>e<0||t<0||e>=nt||t>=nt||rt[t*nt+e]<=.5;if(n(t-8,e)||n(t+8,e)||n(t,e-8)||n(t,e+8))for(let n of[0,zf])en.push(new Z(t/nt-.5,.5-e/nt,n))}let tn=e=>{let t=new Set;for(let n of new ud().setFromPoints(e).faces){let e=n.edge;do t.add(e.head().point),e=e.next;while(e!==n.edge)}return t.size>=4?[...t]:e},nn=tn(en),rn=[],X=new Z;function on(){let e=[...en,...Y.silhouette()];X.set(0,0,0);for(let t of e)X.add(t);X.divideScalar(Math.max(1,e.length)),rn=tn(e)}let sn=new Z(0,0,zf);function cn(e,t,n){let r=an.degToRad(e),i=an.degToRad(t),a=new Z(Math.sin(i)*Math.sin(r),-Math.cos(i)*Math.sin(r),Math.cos(r)),o=new Z(-Math.sin(i),Math.cos(i),0).cross(a).normalize(),s=new Z().crossVectors(a,o),c=X.clone(),l=n*ZD*(1-2*eO),u=0,d=0,f=new Z,p=(e,t)=>{let r=1/0,i=-1/0,c=1/0,l=-1/0;for(let u of e){f.subVectors(u,t);let e=-f.dot(a);if(e<=1e-4)continue;let d=f.dot(o)/e*n,p=f.dot(s)/e*n;r=Math.min(r,d),i=Math.max(i,d),c=Math.min(c,p),l=Math.max(l,p)}return[r,i,c,l]};for(let e=0;e<4;e++){let e=c.clone().addScaledVector(a,n),[t,r,i,f]=p(rn,e);if(!Number.isFinite(t))break;let[m,h,g,_]=r-t>l||f-i>l?p(nn,e):[t,r,i,f];c.addScaledVector(o,Yp(t,r,m,h,l)).addScaledVector(s,Yp(i,f,g,_,l)),u=r-t,d=f-i}return{pivot:c,w:u,h:d}}let ln=()=>1/(Qt*ZD)/J.zoom,un=(e,t)=>qt===`camera`?cn(e,t,ln()).pivot:sn.clone();function dn(){let e=QD;for(let t=0;t<3;t++){let t=1/(e*ZD),n=0;for(let e of tO)for(let r=0;r<nO;r++){let{w:i,h:a}=cn(e,360*r/nO-180,t);n=Math.max(n,i,a)}let r=Math.min(QD,(1-2*eO)/Math.max(n,1e-6)),i=Math.abs(r-e)<.005;if(e=r,i)break}return Math.max($D,e)}new ResizeObserver(()=>n.style.setProperty(`--shutter-w`,`${ne.offsetWidth}px`)).observe(ne);let fn=0;function pn(){n.classList.add(`zoning`),clearTimeout(fn),fn=window.setTimeout(()=>n.classList.remove(`zoning`),400)}function mn(){let e=n.clientWidth,t=n.clientHeight,r=getComputedStyle(n),i=(e,t)=>parseFloat(r.getPropertyValue(e))||t,a=i(`--top-h`,40),o=i(`--shutter-room`,66),s=B.offsetHeight||124,c=(qt===`camera`&&i(`--one-row`,0)===1?s*i(`--peek`,.5)+i(`--cam-rise`,0):s)+(parseFloat(getComputedStyle(R).paddingBottom)||0);if(qt===`camera`){let n=c+o,r=8+(parseFloat(getComputedStyle(ue).lineHeight)||20)+8,i=e/2,a=me.getClientRects().length>0?me.getBoundingClientRect().height:parseFloat(getComputedStyle(me).paddingTop)||0,s=t-a-n-2*r,l=Math.max(120,Math.min(e-24,s,760)),u=a+r+s/2;Yt={left:i-l/2,top:u-l/2,width:l,height:l},Object.assign(se.style,{left:`${Yt.left}px`,top:`${Yt.top}px`,width:`${l}px`,height:`${l}px`});let d=an.radToDeg(2*Math.atan(t/l*ZD/2));return{cx:i,cy:u,side:l*Qt,fov:d}}let l=t-a-c-o,u=Math.min(e*.97,l*.96)*Zp[Zt];return{cx:e/2,cy:a+l/2,side:u,fov:J.fov}}let hn=[``,``];function gn(e){Xt=e,J.layout(n.clientWidth,n.clientHeight,e.cx,e.cy,e.side,e.fov),ce.hidden=e.cx-.62*e.side<=0;let t=`${e.cx}px`,r=`${e.side}px`;(t!==hn[0]||r!==hn[1])&&(hn=[t,r],n.style.setProperty(`--slice-x`,t),n.style.setProperty(`--slice-s`,r)),Y.placeHandle(),qn()}function _n(){$t=null,gn(mn())}function vn(e,t){let n=mn(),r=((J.orbit-t)%360+540)%360-180+t;$t={from:{...Xt},to:n,tilt:[J.tilt,e],orbit:[r,t],pivot:[J.pivot.clone(),un(e,t)],start:performance.now()}}function yn(e){if(!$t)return;let t=Math.min(1,(e-$t.start)/JD),n=1-(1-t)**3,r=(e,t)=>e+(t-e)*n;J.tilt=r($t.tilt[0],$t.tilt[1]),J.orbit=r($t.orbit[0],$t.orbit[1]),J.pivot.lerpVectors($t.pivot[0],$t.pivot[1],n);let{from:i,to:a}=$t;gn({cx:r(i.cx,a.cx),cy:r(i.cy,a.cy),side:r(i.side,a.side),fov:r(i.fov,a.fov)}),t>=1&&($t=null)}function bn(){if(qt!==`edit`||Et||Bn.size>0||Y.dragging)return;let e=Qp(Y.height*11,Zt);e!==Zt&&(Zt=e,n.classList.contains(`loading`)?_n():vn($t?$t.tilt[1]:J.tilt,$t?$t.orbit[1]:J.orbit))}new ResizeObserver(_n).observe(n),_n();let xn=new hT(n,De,new Map(t_.map(e=>[e,{frame:s_(`lump-${e}-1`),scale:PD[e]??1}]))),Sn=v(G),Cn=!1,wn=e=>B.querySelector(`[data-pot="${e}"]`);function Tn(e,t){let n=wn(e);if(!n||(B.querySelectorAll(`.item.loaded`).forEach(e=>e.classList.remove(`loaded`)),n.classList.add(`loaded`),B.firstElementChild===n))return;let r=[...B.children],i=new Map(r.map(e=>[e,e.getBoundingClientRect().left]));if(B.prepend(n),t){for(let e of r){let t=i.get(e)-e.getBoundingClientRect().left;Math.abs(t)>.5&&e.animate([{translate:`${t}px 0`},{translate:`0 0`}],{duration:280,easing:`ease-out`})}B.scrollTo({left:0,behavior:`smooth`})}else B.scrollLeft=0}function En(e,t,r){let i=r?.getBoundingClientRect(),a=n.getBoundingClientRect();e.textContent=t;let o=i?i.left-a.left+i.width/2:a.width/2,s=e.offsetWidth/2,c=ne.getBoundingClientRect(),l=c.left-a.left-10,u=c.right-a.left+10;qt===`edit`&&o+s>l&&o-s<u&&(o=o<(l+u)/2?l-s:u+s),e.style.left=Dn(e,o,a.width),e.classList.add(`on`)}function Dn(e,t,n){let r=e.offsetWidth/2;return`${Math.min(n-r-8,Math.max(r+8,t))}px`}let On=0;function kn(e,t,n){En(U,e,t);let r=U.getBoundingClientRect();for(let e of re){let t=e.getBoundingClientRect();e.classList.toggle(`yield`,r.left<t.right+8&&r.right>t.left-8)}clearTimeout(On),n>0&&(On=window.setTimeout(An,n))}function An(){clearTimeout(On),U.classList.remove(`on`);for(let e of re)e.classList.remove(`yield`)}let jn=UE(),Mn=Ee&&!we,Nn=Mn?new qE(n,De):null,Pn=null,Fn=0,In=0,Ln=0,Rn=!1,zn=null,Bn=new Set,Vn=0;n.addEventListener(`pointerdown`,e=>{Bn.add(e.pointerId),Vn=performance.now(),Pn===`spread`?Nn?.stop():Pn===`pull`&&ie(e.target)||Xn()},{capture:!0});let Hn=e=>{Bn.delete(e.pointerId)&&(Vn=performance.now())};window.addEventListener(`pointerup`,Hn,{capture:!0}),window.addEventListener(`pointercancel`,Hn,{capture:!0});function Un(){if(!Mn||Rn||!VE(`spread`,jn)||qt!==`edit`)return;let e=B.querySelector(`.item.top`),t=zn=new AbortController,r={signal:t.signal},i=B.scrollLeft;if(t.signal.addEventListener(`abort`,()=>{e?.classList.remove(`peek`),Rn||(Gn(`spread`),Jn());let n=()=>void(B.style.scrollSnapType=``);if(t.signal.reason===`strip`||Math.abs(B.scrollLeft-i)<1)return n();let r=new AbortController;r.signal.addEventListener(`abort`,n),B.addEventListener(`pointerdown`,()=>r.abort(),{signal:r.signal,capture:!0}),B.addEventListener(`wheel`,()=>r.abort(),{signal:r.signal,passive:!0});for(let e of re)e.addEventListener(`click`,()=>r.abort(),{signal:r.signal});Yn(B.scrollLeft,i,400,r.signal,()=>r.abort())}),oe.matches||!e)return t.abort();if(Bn.size>0||B.scrollLeft>1)return t.abort(`strip`);n.addEventListener(`pointerdown`,e=>t.abort(ie(e.target)?`strip`:`finger`),{...r,capture:!0}),B.addEventListener(`wheel`,()=>t.abort(`strip`),{...r,passive:!0});let a=B.getBoundingClientRect(),o=e.getBoundingClientRect(),s=o.left>=a.left&&o.right<=a.right-8,c=Gt()+16,l=s?i:Math.min(B.scrollWidth-B.clientWidth,Math.max(0,i+o.left-a.left-c));Yn(i,l,s?0:900,t.signal,()=>{xx(e,`peek`),setTimeout(()=>{t.signal.aborted||(s?t.abort(`done`):Yn(l,i,700,t.signal,()=>t.abort(`done`)))},1100)})}function Wn(e,t,n){VE(e,jn)&&setTimeout(()=>{xr()||Et||!t()||(Qn(e),Gn(e),n?.())},LD)}function Gn(e){let t=BE[e];Xn(),Pn=e;let n=ae.matches&&t.mouse||t.touch;qt===`camera`?(ue.classList.remove(`board`),ue.style.top=``,En(ue,n,null)):Kn(n),t.ms>0&&(Fn=window.setTimeout(Xn,t.ms))}function Kn(e){let t=n.getBoundingClientRect(),[r,i]=J.toScreen(new Z(0,.5,zf)),a=me.getBoundingClientRect().bottom;ue.textContent=e,ue.classList.add(`board`);let o=ue.offsetHeight,s=i-a>=o+16?(a+i)/2:a+o/2+10;ue.style.left=Dn(ue,r-t.left,t.width),ue.style.top=`${s-t.top}px`,ue.classList.add(`on`)}function qn(){ue.classList.contains(`on`)&&ue.classList.contains(`board`)&&Kn(ue.textContent??``)}function Jn(){if(clearTimeout(In),!Nn||Pn!==`spread`||Ln>=RD||oe.matches)return;let e=performance.now()-Vn;if(Bn.size>0||e<BD){In=window.setTimeout(Jn,Math.max(500,BD-e));return}Ln++;let t=(e,t)=>J.toScreen(new Z(e,t,zf));Nn.play(t(-.12,.28),t(-.12,-.26),J.pxPerUnit*.9),In=window.setTimeout(Jn,zD)}function Yn(e,t,n,r,i){let a=e=>e<.5?2*e*e:1-(2-2*e)**2/2,o=0,s=c=>{if(r.aborted)return;let l=n>0?Math.min(1,(c-o)/n):1;B.scrollLeft=e+(t-e)*a(l),l<1?requestAnimationFrame(s):i()};B.style.scrollSnapType=`none`,requestAnimationFrame(e=>{o=e,s(e)})}function Xn(){clearTimeout(Fn),clearTimeout(In),Nn?.stop(),Pn=null,ue.classList.remove(`on`)}function Zn(e){Pn===e&&Xn(),Qn(e)}function Qn(e){jn.has(e)||(jn.add(e),WE(jn))}B.addEventListener(`click`,e=>{if(Et)return;let t=e.target.closest(`button[data-pot]`),n=t?.dataset.pot,r=n?Od[n]:void 0;t&&n&&r&&ir===null&&(ve.unlock(),ve.play(`aufstrich-aufnehmen`),xn.play(t,s_(`pot-${n}`),n),et.refill(r),dt.refill(n),bt(),Sn=n,Cn=!1,t.classList.add(`loaded`),B.querySelectorAll(`.item.loaded`).forEach(e=>e!==t&&e.classList.remove(`loaded`)),$n=performance.now(),kn(n_[n]??n,t,1e3),setTimeout(()=>Sn===n&&Tn(n,!0),560))});let $n=-1/0;B.addEventListener(`pointerover`,e=>{if(e.pointerType!==`mouse`||qt!==`edit`||performance.now()-$n<1200)return;let t=e.target.closest(`button[data-pot]`);t?.dataset.pot&&kn(n_[t.dataset.pot]??``,t,0)}),B.addEventListener(`pointerout`,e=>{e.pointerType!==`mouse`||performance.now()-$n<1200||e.relatedTarget?.closest?.(`button[data-pot]`)||An()});function er(){if(Cn||et.fill>=HD)return;Cn=!0;let e=wn(Sn);e&&(xx(e,`nudge`),kn(`Fast leer`,e,2400))}let tr=J.canvas,nr=tt.bladeWidth,rr=(e,t)=>{let n=J.pointOnPlane(e,t,zf);if(!n)return null;let r=e=>Math.min(nt+nr,Math.max(-nr,e));return[r((n.x+.5)*nt),r((.5-n.y)*nt)]},ir=null,ar=[],or=null,sr=!1,cr=null,lr=!1;tr.addEventListener(`pointerdown`,e=>{if(Et||qt!==`edit`||ir!==null||Sr())return;let t=Y.hitTest(e.clientX,e.clientY);if(t){zt=null,Y.beginDrag(t,e),e.preventDefault();return}let n=rr(e.clientX,e.clientY);!n||n[0]<0||n[1]<0||n[0]>=nt||n[1]>=nt?Y.deselect():(ir=e.pointerId,sr=!1,Y.deselect(),tr.setPointerCapture(e.pointerId),ar.length=0,or=n,cr=n,e.preventDefault())}),tr.addEventListener(`pointermove`,e=>{if(e.pointerId!==ir){e.pointerType===`mouse`&&e.buttons===0&&qt===`edit`&&!Et&&mr(e.clientX,e.clientY);return}let t=typeof e.getCoalescedEvents==`function`?e.getCoalescedEvents():[];t.length===0&&t.push(e);for(let e of t){let t=rr(e.clientX,e.clientY);if(!t)continue;let n=Y.knifeAt(e.clientX,e.clientY),r=n===`on`;r!==sr&&(sr=r,r?fr():or=n===`gave`&&cr?cr:t),r||(ar.push(t[0],t[1]),cr=t)}e.preventDefault()});let ur=e=>{e.pointerId===ir&&dr()};function dr(){ir!==null&&(ir=null,Y.knifeUp(),gr(),lr&&pr())}function fr(){or&&ar.length===0?or=null:(gr(),lr&&pr())}function pr(){lr=!1;let e=et.end();dt.end(),bt(),Y.settle(),vt(),e&&Zn(`spread`),e&&P(`Erster Strich`)}tr.addEventListener(`pointerup`,ur),tr.addEventListener(`pointercancel`,ur),tr.addEventListener(`contextmenu`,e=>e.preventDefault());function mr(e,t){let n=``;if(Y.hitTest(e,t))n=`grab`;else{let r=J.pointOnPlane(e,t,zf);r&&ot(r.x,r.y)&&(n=`knife`)}tr.dataset.cursor!==n&&(tr.dataset.cursor=n)}tr.addEventListener(`pointerleave`,()=>tr.dataset.cursor=``),n.addEventListener(`wheel`,e=>{Et||qt!==`edit`||e.target!==tr||Y.turnAt(e.clientX,e.clientY,-e.deltaY*.0025)&&(e.preventDefault(),e.stopPropagation())},{capture:!0,passive:!1});let hr=5*nt/512;function gr(){if(or&&(et.begin(or[0],or[1]),dt.begin(or[0],or[1]),or=null,lr=!0),ar.length===0)return;let e=0,[t,n]=et.lastPoint;for(let r=0;r<ar.length;r+=2)e+=Math.hypot(ar[r]-t,ar[r+1]-n),t=ar[r],n=ar[r+1];et.spacing=Math.min(hr,Math.max(tt.stampSpacing,e/30)),dt.spacing(et.spacing);for(let e=0;e<ar.length;e+=2)et.moveTo(ar[e],ar[e+1]),dt.point(ar[e],ar[e+1]);ar.length=0}n.addEventListener(`dragstart`,e=>e.preventDefault());let _r=!0,vr=null,yr=null;function br(e,t,r){de.replaceChildren();let i=e(de);_r=t,vr=i??(t?()=>Sr():null),de.setAttribute(`role`,`dialog`),de.setAttribute(`aria-modal`,`true`),de.setAttribute(`aria-label`,r.label),de.classList.toggle(`from-top`,!!r.fromTop),r.opener?yr=r.opener:!yr&&document.activeElement instanceof HTMLElement&&!de.contains(document.activeElement)&&(yr=document.activeElement),yr?.hasAttribute(`aria-haspopup`)&&yr.setAttribute(`aria-expanded`,`true`),de.hidden=!1,de.offsetWidth,de.classList.add(`open`),n.classList.add(`sheet-open`),de.querySelector(`button, a[href]`)?.focus({preventScroll:!0})}function xr(){return de.classList.contains(`open`)}function Sr(e=!1){return!xr()||!_r&&!e?xr():(de.classList.remove(`open`),n.classList.remove(`sheet-open`),vr=null,yr?.hasAttribute(`aria-haspopup`)&&yr.setAttribute(`aria-expanded`,`false`),de.contains(document.activeElement)&&yr?.isConnected&&!yr.closest(`[hidden]`)&&yr.focus({preventScroll:!0}),yr=null,setTimeout(()=>{de.classList.contains(`open`)||(de.hidden=!0)},260),St(),!0)}function Cr(e,t,n){if(xr()&&!_r)return;let r=de.classList.contains(`open`),i=r&&yr===e;r&&Sr(),i||br(n,!0,{label:t,fromTop:!0,opener:e})}document.addEventListener(`keydown`,e=>{if(e.key!==`Tab`||!xr()||e.altKey||e.ctrlKey||e.metaKey)return;let t=[...de.querySelectorAll(`button:not(:disabled), a[href], input, iframe, [tabindex]:not([tabindex="-1"])`)].filter(e=>e.getClientRects().length>0),n=t[0],r=t.at(-1);if(!n||!r)return void e.preventDefault();let i=t.indexOf(document.activeElement),a=i<0?e.shiftKey?r:n:e.shiftKey&&i===0?r:!e.shiftKey&&i===t.length-1?n:null;a&&(e.preventDefault(),a.focus({preventScroll:!0}))}),document.addEventListener(`keydown`,e=>{if(e.key===`Escape`){if(xr()){if(!vr)return;e.preventDefault(),vr()}else qt===`camera`&&(e.preventDefault(),Mr())}});let wr=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=`word`,n.textContent=e,n.addEventListener(`click`,t),n},Tr=(...e)=>{let t=document.createElement(`div`);return t.className=`words`,t.append(...e),t},Er=(e,t=``,n=`p`)=>{let r=document.createElement(n);return r.className=e,r.textContent=t,r},Dr=e=>Er(`sheet-title`,e,`h2`);fe.addEventListener(`click`,()=>{Cr(fe,`New sandwich`,e=>{e.append(Dr(`New sandwich`)),ht&&!VD(mt?Y.placed:G.toppings,G.ops)&&!g()&&e.append(Er(`sheet-note`,`Your sandwich so far will be lost.`));let t=document.createElement(`div`);t.className=`basket`;for(let e of E){let n=document.createElement(`button`);n.type=`button`,n.className=`bread`;let r=document.createElement(`img`);r.src=`./scene/${e.id}-thumb.webp`,r.alt=``,r.draggable=!1;let i=document.createElement(`span`);i.textContent=e.name,n.append(r,i),n.addEventListener(`click`,()=>kr(e.id,`slice`)),t.append(n)}e.append(t);let n=wr(`Surprise sandwich`,()=>kr(G.bread,`random`));n.dataset.act=`random`,e.append(Tr(n))})});let Or=()=>Cr(W,`Help`,e=>{e.append(Dr(`Help`),pe.content.cloneNode(!0),Tr(wr(`Got it`,()=>Sr())))});W.addEventListener(`click`,Or),document.addEventListener(`keydown`,e=>{e.key!==`?`||e.ctrlKey||e.metaKey||e.altKey||qt!==`edit`||e.target?.closest?.(`input, textarea, [contenteditable]`)||(e.preventDefault(),Or())});function kr(e,t){pt=!0,C(b(e)),A(DD,t,`session`),P(`New sandwich`,{was:t===`random`?`Zufall`:`Bread`}),Sr(),n.classList.add(`leaving`),setTimeout(()=>location.replace(location.href),220)}function Ar(){dr(),qt=`camera`,Y.deselect(),Y.dropTaps(),Xn(),An(),pn(),n.classList.add(`cam`),R.setAttribute(`aria-label`,`Back to the sandwich`),se.hidden=!1,on(),Qt=dn(),Rr(GD),history.state?.cam||history.pushState({cam:!0},``),P(`Kameramodus`),Wn(`camera`,()=>qt===`camera`&&Bn.size===0)}function jr(){qt=`edit`,zr=null,Xn(),pn(),n.classList.remove(`cam`),R.setAttribute(`aria-label`,z),se.hidden=!0,Lr(-1),vn(Jt[0],Jt[1]),Mn&&!Rn&&VE(`spread`,jn)&&Gn(`spread`)}function Mr(){qt!==`camera`||Nr||(history.state?.cam?(Nr=!0,history.back()):Pr())}let Nr=!1;function Pr(){Wr(),xr()&&Sr(!0),jr()}window.addEventListener(`popstate`,()=>{Nr=!1,qt===`camera`&&!history.state?.cam?Pr():qt===`edit`&&history.state?.cam&&!Et&&(mt&&!Y.dragging?(Sr(!0),Ar()):history.back())}),history.state?.cam&&history.replaceState(null,``),he.addEventListener(`click`,Mr);let Fr=!1;B.addEventListener(`pointerdown`,e=>{Fr=qt===`camera`,Fr&&(e.stopPropagation(),e.button===0&&!xr()&&Mr())},{capture:!0}),B.addEventListener(`click`,e=>{let t=Fr&&e.detail>0;Fr=!1,(t||qt===`camera`)&&(e.stopPropagation(),xr()||Mr())},{capture:!0});let Ir=WD.map(([e],t)=>{let n=wr(e,()=>Rr(t));return n.setAttribute(`aria-pressed`,`false`),ge.append(n),n});function Lr(e){Ir.forEach((t,n)=>t.setAttribute(`aria-pressed`,String(n===e)))}function Rr(e){let[,t,n]=WD[e];Lr(e),vn(t,n)}let zr=null;n.addEventListener(`pointerdown`,e=>{Et||qt!==`camera`||e.target!==tr||zr||xr()||(e.stopPropagation(),e.preventDefault(),$t=null,J.orbit=(J.orbit%360+540)%360-180,tr.setPointerCapture(e.pointerId),zr={id:e.pointerId,x:e.clientX,y:e.clientY})},{capture:!0}),tr.addEventListener(`pointermove`,e=>{if(!zr||e.pointerId!==zr.id)return;let t=e.clientX-zr.x,n=e.clientY-zr.y;zr.x=e.clientX,zr.y=e.clientY,J.orbit=((J.orbit-t*KD)%360+540)%360-180,J.tilt=Math.min(UD,Math.max(0,J.tilt-n*qD)),J.pivot.copy(un(J.tilt,J.orbit)),J.placeCamera(),(t||n)&&(Lr(-1),Zn(`camera`))});let Br=e=>{zr?.id===e.pointerId&&(zr=null)};tr.addEventListener(`pointerup`,Br),tr.addEventListener(`pointercancel`,Br);let Vr=!1;ne.addEventListener(`click`,async()=>{if(ve.unlock(),!mt||Y.dragging)return;if(qt===`edit`){Sr(!0),Ar();return}if(Vr||$t)return;Vr=!0,ve.shutter(),le.classList.remove(`on`),le.offsetWidth,le.classList.add(`on`);let e=tr.getBoundingClientRect(),t=n.getBoundingClientRect(),r={...Yt,left:Yt.left+t.left-e.left,top:Yt.top+t.top-e.top},i={rotation:J.orbit,tilt:J.tilt,distance:J.cameraDistance,fov:YD};try{let e=J.capture(r,f.w,f.h),t=J.capture(rD(r),D.w,D.h),[n,a]=await Promise.all([pD(e),dD(e)]).finally(()=>nf(e));Gr({og:t,jpeg:n,thumb:a},i),P(`Foto`)}catch(e){console.error(e)}finally{Vr=!1}});let Hr=null,Ur=null;function Wr(){Hr&&URL.revokeObjectURL(Hr),Hr=null,Ur&&nf(Ur),Ur=null}function Gr(t,n){Wr(),M(),cD();let r=URL.createObjectURL(t.jpeg);Hr=r,Ur=t.og,br(i=>{let a=document.createElement(`img`);a.className=`shot`,a.src=r,a.alt=`Your sandwich`;let l=Tr(),u=null,d=Er(`sheet-note`);d.hidden=!0;let f=wr(`Keep`,async()=>{f.disabled=!0,p.disabled=!0,f.textContent=`Keeping …`,d.hidden=!0,yt();try{u||(u=await F({parentId:c(),parentToken:x(),replyTo:e(),stulle:structuredClone(G),camera:n,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone}),xt()||(o(u.id,u.parent),s(null),_t=!1),P(`Keep`));let{id:r,url:i,upload:a}=u,l={"photo.jpg":t.jpeg,"og.jpg":await uD(t.og,r),"thumb.jpg":t.thumb};Wr(),Kr(r,i,t.jpeg,a?()=>te(r,a,l):null)}catch(e){f.disabled=!1,p.disabled=!1,f.textContent=`Keep`,d.textContent=String(e?.message??e),d.hidden=!1}}),p=wr(`Again`,()=>{Wr(),Sr(!0)});return l.append(f,p),i.append(a,l,d),()=>p.click()},!1,{label:`Your photo`})}function Kr(e,t,n,r){let i=new URL(t,location.origin).href,a=URL.createObjectURL(n);Hr=a,br(n=>{let o=document.createElement(`div`);o.className=`shot small`;let s=document.createElement(`img`);s.src=a,s.alt=``;let c=document.createElement(`span`);c.className=`stamp`,c.ariaHidden=`true`,c.textContent=XE(e),o.append(s,c);let l=Er(`sheet-meta`,ZE(e)),u=Er(`sheet-note`),d=document.createElement(`a`);d.hidden=!0,d.className=`sheet-url`,d.href=t,d.textContent=i.replace(/^https?:\/\//,``);let f=Tr(),p=wr(`Share`,async()=>{let t=await ee(i,ZE(e));P(`Geteilt`,{wie:t===`shared`?`geteilt`:t===`copied`?`kopiert`:`nichts`}),t===`copied`&&(p.textContent=`Copied`),t===`failed`&&getSelection()?.selectAllChildren(d)}),m=wr(`Done`,Mr);n.append(o,l,u,d,f);let h=()=>{u.remove(),d.hidden=!1,f.replaceChildren(p,m)};if(!r)return h(),()=>m.click();let g=r,_=wr(`Again`,()=>void v());async function v(){u.textContent=`Saving …`,f.replaceChildren(m);try{await g(),h()}catch(e){console.warn(`stullen: upload failed`,e),u.textContent=`That didn't work.`,f.replaceChildren(_,m)}}return v(),()=>m.click()},!1,{label:ZE(e)})}let qr=null;if(_e&&!_e.hidden){let{startDebugPanel:e}=await TD(async()=>{let{startDebugPanel:e}=await import(`./debugpanel.hmErAhyS.js`);return{startDebugPanel:e}},__vite__mapDeps([0,1]));qr=e(_e,{root:n,stage:J,sim:et,toppings:Y,stulle:G,look:at,defaultLook:Yf,lookMax:it,table:Ge,seed:Te,loadTopping:Ae,music:()=>ye.says(),mode:()=>qt,onView:e=>{qt===`edit`&&(Jt=[J.tilt,J.orbit]),e?_n():Y.placeHandle()},viewOnly:e=>{Et=e,e&&(Y.deselect(),tr.dataset.cursor=``)},pickAt:(e,t)=>Y.pointAt(e,t),adopt:(e,t)=>{pt=!0;let n=new URL(location.href);OD(e,t,n),location.replace(n)}})}window.stullen={sim:et,toppings:Y,stage:J,stulle:G,loadTopping:Ae,bench:async()=>{let{benchGrids:e}=await TD(async()=>{let{benchGrids:e}=await import(`./simbench.BjrB5lSn.js`);return{benchGrids:e}},[]);await e([512,768,1024],e=>console.log(e))},arrived:jt,loadLog:ux,view:({tilt:e,rotation:t,distance:n,fov:r=16})=>{qt===`camera`&&(Lr(-1),Qt=1/(n*XD(r)*J.zoom),_n(),J.tilt=e,J.orbit=t,J.pivot.copy(un(e,t)),J.placeCamera())},settled:async()=>{for(await Y.whenIdle();n.classList.contains(`loading`)||$t||Vr||J.landing||Y.moving;)await new Promise(requestAnimationFrame)},og:()=>Ur,gpu:()=>AT(J,et,Y),music:ye};let Jr=0,Yr=0,Xr=new lT(Zr);J.onNeed=Xr.wake;for(let e of[`pointerdown`,`pointermove`,`touchstart`,`wheel`,`keydown`])window.addEventListener(e,Xr.wake,{capture:!0,passive:!0});function Zr(e){if(Yr){let e=performance.now();e-Jr>kD&&fx(`Pause`,Jr),Jr=e,e>Yr&&(Yr=0)}yn(e),gr(),et.takeDirty()&&(J.needsRender=!0),ir!==null&&er(),Y.tick(e),bn();let t=J.render(e);return qr?.frame(e),t||J.needsRender||J.landing||$t!==null||ir!==null||Y.busy||et.reading||ar.length>0||or!==null||!!qr||n.classList.contains(`loading`)}let Qr=()=>new Promise(e=>requestAnimationFrame(()=>e()));requestAnimationFrame(async()=>{if(await J.compileAhead(),dx(`Shader bereit`),Jr=performance.now(),px(`erstes Bild`,()=>Xr.tick(Jr)),qr&&(Yr=performance.now()+AD),await Promise.all([Ct,Ot]),J.held=!0,Mt(),await J.compileAhead(),J.held=!1,await Promise.race([Lt.catch(e=>console.warn(`stullen: tray not warmed`,e)),new Promise(e=>setTimeout(e,jD))]),dx(`Tablett warm`),Se){await Promise.race([Y.whenKeptLaid(),new Promise(e=>setTimeout(e,MD))]);for(let e=performance.now()+ND;Y.gliding&&performance.now()<e;)await Qr();dx(`Belag wie behalten`)}J.needsRender=!0,await Qr(),xe===`slice`&&J.land(),xe===`random`&&Y.fallIn(),j.end(),n.classList.remove(`loading`),Tn(Sn,xe!==null),dx(`erstes Bild da`),P(`Editor bereit`,{laden:r?`im Hintergrund`:N(performance.now())},!0),setTimeout(Un,ID)})}j();var aO=document.getElementById(`editor`);aO&&(new URLSearchParams(location.search).has(`debug`)&&aO.querySelector(`.debug`)?.removeAttribute(`hidden`),iO(aO).catch(e=>{console.error(e),I(`Start`,e),aO.classList.remove(`loading`);let t=document.createElement(`p`);t.className=`error`,t.setAttribute(`role`,`alert`);let n=df(e);if(t.append(n),n!==`Sorry, this device can't spread butter. Another browser might.`){let e=document.createElement(`a`);e.href=location.href,e.textContent=`Reload`,t.append(` `,e)}new URLSearchParams(location.search).has(`debug`)&&t.append(document.createElement(`br`),String(e?.message??e)),aO.appendChild(t)}));export{nd as _,Ax as a,yv as c,qp as d,Gp as f,Ad as g,Od as h,Vx as i,Xp as l,Yd as m,QE as n,ux as o,zf as p,AT as r,bv as s,TD as t,Kp as u,an as v,Z as y};