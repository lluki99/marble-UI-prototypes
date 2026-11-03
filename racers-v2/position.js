(function(root,factory){if(typeof module==='object')module.exports=factory();else root.RacePosition=factory();})(globalThis,()=>{
 function ordinal(position){if(!Number.isSafeInteger(position)||position<1)throw new RangeError('Race position must be a positive integer');const lastTwo=position%100;const suffix=lastTwo>=11&&lastTwo<=13?'th':({1:'st',2:'nd',3:'rd'}[position%10]||'th');return position+suffix;}
 return{ordinal};
});
