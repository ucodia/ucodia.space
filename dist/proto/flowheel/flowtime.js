var flowtime = (function() {
  var mSeed, mSequence = [];
  var hSeed, hSequence = [];

  function getUTCEquivalent(origin) {
    var utcEquivalent = new Date(origin);

    // remove the timezone to get UTC equivalent
    utcEquivalent.setUTCFullYear(origin.getFullYear());
    utcEquivalent.setUTCMonth(origin.getMonth());
    utcEquivalent.setUTCDate(origin.getDate());
    utcEquivalent.setUTCHours(origin.getHours());
    utcEquivalent.setUTCMinutes(origin.getMinutes());
    utcEquivalent.setUTCSeconds(origin.getSeconds());
    utcEquivalent.setUTCMilliseconds(origin.getMilliseconds());

    return utcEquivalent;
  }

  function getSeedsFromDate(date) {
    var seedDate = new Date(date);
    var utcSeedDate = getUTCEquivalent(seedDate);

    // to generate a sequence of numbers unique to an hour
    // we need to find a seed unique to that hour
    // we do so by resetting all time periods withing that hour
    // and finally extract the timestamp to use as a seed
    utcSeedDate.setMilliseconds(0);
    utcSeedDate.setSeconds(0);
    utcSeedDate.setMinutes(0);
    var seedMSeed = utcSeedDate.getTime() / 1000;
    
    // same thing to generate a sequence unique to a day
    utcSeedDate.setHours(0);
    var seedHSeed = utcSeedDate.getTime() / 1000;

    return {
      minute: seedMSeed,
      hour: seedHSeed
    };
  }

  function getSequenceFromLcg(lcg, length) {
    var values = [];

    // generate sequence
    for (var i = 0; i < length; i++) {
      values.push(lcg.rand());
    }

    // copy and sort sequence
    var sorted = values.slice().sort();

    // normalize values based on their order
    for (var i = 0; i < sorted.length; i++) {
      values[values.indexOf(sorted[i])] = i;
    }

    return values;
  }

  function getHourLcg(seed) {
    // values from the Numerical Recipes book
    return lcg()
      .withModulus(4294967296)
      .withMultiplier(1664525)
      .withIncrement(1013904223)
      .withSeed(seed);
  }

  function getMinuteLcg(seed) {
    // values from MINSTD 
    return lcg()
      .withModulus(2147483647)
      .withMultiplier(48271)
      .withIncrement(0)
      .withSeed(seed);
  }

  function getFlowTime(real) {
    var flow = new Date(real.getTime());

    // extract seeds
    var seed = getSeedsFromDate(real);

    // generate sequences
    if (seed.minute !== mSeed) {
      mSeed = seed.minute;
      var mLcg = getMinuteLcg(mSeed);
      mSequence = getSequenceFromLcg(mLcg, 60);
    }
    if (seed.hour !== hSeed) {
      hSeed = seed.hour;
      var hLcg = getHourLcg(hSeed);
      hSequence = getSequenceFromLcg(hLcg, 24);
    }

    // set flow time
    flow.setMinutes(mSequence[real.getMinutes()]);
    flow.setHours(hSequence[real.getHours()]);

    return flow;
  }

  return {
    now: function() {
      return getFlowTime(new Date());
    },
    fromDate: function(date) {
      return getFlowTime(date);
    }
  }
}());

// linear congruential generator builder
// https://en.wikipedia.org/wiki/Linear_congruential_generator
var lcg = function() {
  var m, a, c, seed, z;

  return {
    withSeed: function(val) {
      z = seed = val;
      return this;
    },
    withModulus: function(val) {
      m = val;
      return this;
    },
    withMultiplier: function(val) {
      a = val;
      return this;
    },
    withIncrement: function(val) {
      c = val;
      return this;
    },
    rand: function() {
      z = (a * z + c) % m;
      return z / m;
    }
  }
}
