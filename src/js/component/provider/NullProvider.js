import IProvider from "./IProvider";
import React from 'react';

class NullProvider extends IProvider {

  hints = {
    0 /*Sunday*/: [
      <>
        <p><strong>The small-improvements method</strong> – the observation that
          psychologically frequently making small incremental improvements is
          a better approach than attempting to fix big looming problems once.</p>
      </>,
      <>
        <a href="https://www.joelonsoftware.com/2002/01/06/fire-and-motion/">The just-get-started method</a> – Joel
        Spolsky’s observation that
        just starting to work on a small, concrete, finishable problem puts
        your consciousness in a productive state.<br/>
        <strong>Corollary:</strong> Just do something concrete. Anything. Do your
        laundry, or dust the counters, or add a single unit test. Just do
        something.
      </>,
      <>
        <a href="http://www.cs.virginia.edu/~robins/YouAndYourResearch.html">The top-five-problems method</a> –
        Richard Hamming’s algorithm for
        doing important work. Periodically ask yourself: “what are the top
        five most important problems in my field (and life), and why am I
        not working on them?”<br/>
        <strong>Corollary:</strong> What are the top five most important problems in your
        field (and life), and why aren’t you working on them?
      </>,
      <>
        <p><strong>The LRU prioritization method</strong> – since you can only work on one
          problem at a time, it’s usually sufficient to pick the most
          important problem, work on that, and ignore everything else. This
          method also works with organizing most things (from email to
          physical possessions).</p>
      </>,
      <>
        <a href="http://www.pitt.edu/~druzdzel/feynman.html">The teaching method</a> – Richard Feynman’s
        observation
        that teaching
        the basics is an excellent method for generating profound new ideas,
        and for putting consciousness in a productive state.<br/>
        <strong>Corollary:</strong> If you’re stuck, put yourself in a position where you
        have to teach someone the basics.
      </>,
      <>
        <p><a href="https://en.wikipedia.org/wiki/Planning_fallacy">Planning fallacy</a> – the observation that
          humans
          are overly
          optimistic when predicting success of their
          undertakings. Empirically, the average case turns out to be worse
          than the worst case human estimate.<br/>
          <strong>Corollary:</strong> Be <em>really</em> pessimistic when estimating. Assume the
          average case will be slightly worse than the hypothetical worst
          case.<br/>
          <strong>Corollary:</strong> When estimating time, upgrade the units and double
          the estimate (e.g. convert “one week” to “two months”).</p>
      </>,
      <>
        <a href="https://en.wikipedia.org/wiki/Behavior-shaping_constraint">Forcing function</a> – an external,
        usually social, constraint that
        increases the probability of accomplishing a set of tasks.<br/>
        <strong>Example:</strong> Pair programming.
      </>
    ],
    1: [ <><p><a href="https://en.wikipedia.org/wiki/Efficient-market_hypothesis">Efficient market hypothesis</a> – the
      state of any given issue in the world is <em>roughly</em> as close to optimal as is currently possible.<br/>
      <strong>Corollary:</strong> It’s unlikely that the status quo can be easily improved without significant
      resources.<br/> <strong>Example:</strong> Cucumber juice probably doesn’t cure cancer.<br/>
      <strong>Example:</strong> The iPhone app you wrote in a weekend probably doesn’t double the phone’s battery life.
    </p></>, <><p><a href="https://en.wikipedia.org/wiki/Statistical_mechanics">Statistical mechanics</a> –
      probabalistic systems that follow certain laws in the long run can have perturbations that diverge from these laws
      in the short run.<br/> <strong>Corollary:</strong> Occasionally the status quo <em>can</em> be easily improved
      without significant resources (but it is unlikely that <em>you</em> found such an occassion).<br/>
      <strong>Idiom:</strong> In the short run the market is a voting machine, but in the long run it is a weighing
      machine.<br/> <strong>Idiom:</strong> If an economist saw a $100 bill on a sidewalk they wouldn’t pick it up
      (because if it were real, it would have been picked up already).</p></>, <><p><a
      href="https://en.wikipedia.org/wiki/Base_rate">Base rates</a> – you can approximate the likelihood of a specific
      event occurring by examining the wider probability distribution of similar events.<br/>
      <strong>Example:</strong> You’re evaluating the probability of success of a given startup. Ask yourself, if you
      saw ten similar startups a year, how many of them are likely to succeed?<br/> <strong>Example:</strong> You caught
      an employee stealing, but they claim they need money to buy medication and it’s the first time they’ve ever stolen
      anything. Ask yourself, if you saw ten employee thefts a year, how many of them are likely to be first
      offences?<br/> <strong>Note:</strong> This method is especially useful to combat <a
        href="https://en.wikipedia.org/wiki/Optimism_bias">optimism</a> and <a
        href="https://en.wikipedia.org/wiki/Overconfidence_effect">overconfidence</a> biases, or when evaluating
      outcomes of events you’re emotionally close to.<br/> <strong>See also:</strong> <a
        href="http://lesswrong.com/lw/3m6/techniques_for_probability_estimates/">Techniques for probability
        estimates</a>, <a href="https://en.wikipedia.org/wiki/Reference_class_forecasting">reference class
        forecasting</a>, <a href="https://en.wikipedia.org/wiki/Prior_probability">prior probability</a>.</p></>, <><p>
      <a href="https://en.wikipedia.org/wiki/Emic_and_etic">Emic vs etic</a> (aka inside vs outside view) – two
      perspectives you can choose when evaluating persuasive arguments. The inside view is time consuming and requires
      you to engage with the arguments on their merits. The outside view only requires you ask “what kind of person does
      sincerely believing this stuff turn you into?”<br/> <strong>Corollary:</strong> You can <em>usually</em> predict
      correctness of arguments by evaluating superficial attributes of the people making them.<br/>
      <strong>Example:</strong> If someone is wearing funny clothes, purports to know the one true way, and keeps
      talking about the glorious leader, you can usually dismiss their arguments without deeper examination.<br/>
      <strong>Warning:</strong> This method usually works because most kooky people aren’t innovators, but will misfire
      in important situations because many innovators initially seem kooky.</p></> ],
    2: [ <><p><strong>Inversion</strong> – the observation that many hard problems are best solved when they’re
      addressed backward. In other words figure out what you don’t want, avoid it, and you’ll get what you do want.<br/>
      <strong>Corollary:</strong> Find out how people commonly fail doing what you do, and avoid failing like them.<br/>
      <strong>Example:</strong> If you want to help India, ask “what is doing the worst damage in India and how can we
      avoid it?”<br/> <strong>See also:</strong> <a
        href="https://en.wikipedia.org/wiki/Failure_mode_and_effects_analysis">Failure mode</a>.</p></>, <><p><strong>Bias
      for action</strong> – in daily life many important decisions are easily reversible. It’s not enough to have
      information – it’s crucial to move quickly and recover if you were wrong, than to deliberate indefinitely.<br/>
      <strong>Idiom:</strong> One test is worth a thousand expert opinions.<br/> <strong>Idiom:</strong> The best thing
      you can do is the right thing, the next best thing is the wrong thing, and the worst thing you can do is
      nothing.<br/> <strong>Note:</strong> The best people do this naturally, without brooding, and with a light touch.
    </p></>, <><p><a href="https://en.wikipedia.org/wiki/Expected_value">Expected value</a> – a simple model for
      evaluating uncertain events (multiply the probability of the event by its value).<br/>
      <strong>Corollary:</strong> Sometimes you’ll have to estimate probabilities when it feels really hard to do.<br/>
      <strong>Example:</strong> Chance of winning NY lotto is 1 in 292,201,338 per game. Let’s say the grand prize is
      $150M and ticket price is $1. Then the expected value is roughly $0.5. Since $0.5 &lt; $1, the model tells us the
      game isn’t worth playing.<br/> <strong>Warning:</strong> Looking at expected value often isn’t enough. You need to
      consider utility to make good decisions.<br/> <strong>See also:</strong> <a
        href="http://lesswrong.com/lw/3m6/techniques_for_probability_estimates/">Techniques for probability
        estimates</a>, <a href="https://wiki.lesswrong.com/wiki/Shut_up_and_multiply">shut up and multiply</a>, <a
        href="http://lesswrong.com/lw/hw/scope_insensitivity/">scope insensitivity</a>.</p></>, <><p><a
      href="https://en.wikipedia.org/wiki/Marginal_utility">Marginal utility</a> – the change in utility from the change
      in consumption of a good. Marginal utility usually diminishes with increase in consumption.<br/>
      <strong>Example:</strong> The first car in your garage improves your life significantly more than the second
      one.<br/> <strong>Example:</strong> Because utility loss from losing a dollar is negligible relative to utility
      gain from winning NY Lotto at ridiculously low odds, it might be worth buying a ticket even at negative expected
      value (but seriously, don’t).<br/> <strong>Corollary:</strong> Think through your utility function carefully.
    </p></>, <><p><a href="https://en.wikipedia.org/wiki/Strategy">Strategy</a> and <a
      href="https://en.wikipedia.org/wiki/Tactic_(method)">tactics</a> – empirically decisions tend to fall into one of
      two categories. Strategic decisions have long-term, gradual, and subtle effects (they’re a gift that keeps on
      giving). Tactical decisions are encapsulated into outcomes that have relatively quick binary resolutions (success
      or failure).<br/> <strong>Example:</strong> Picking a programming language is a strategic decision.<br/>
      <strong>Example:</strong> Picking a line of reasoning when trying to close a sale is a tactical decision.<br/>
      <strong>Corollary:</strong> Most people misuse these terms (e.g. “we need a strategy for this meeting”).</p></> ],
    3: [ <><p><a href="https://en.wikipedia.org/wiki/Intelligence_quotient">IQ</a>, <a
      href="https://doc.research-and-analytics.csfb.com/docView?language…&amp;serialid=mofPYk1Y4WanTeErbeMtPx6ur0SCIcSlaZ7sKGPdQQU%3D">RQ</a>,
      and <a href="https://en.wikipedia.org/wiki/Emotional_intelligence">EQ</a> – respectively, intelligence quotient
      (assessment of the mind’s raw horse power), rationality quotient (assessment of how well the mind’s models map to
      the real world; a measure of efficiency of the IQ’s application to real problems), and emotional quotient (ability
      to recognize and label emotions).<br/> <strong>Corollary:</strong> brilliant people can be jerks and kooks,
      empathic people can have wacky ideas about reality, and effective people can have average intelligence.</p></>, <>
      <p><a href="https://en.wikipedia.org/wiki/Structure_and_agency">Structure and agency</a> – the observation that
        human behavior derives from a balance of internalized cultural patterns and capacity to act independently. The
        interaction of these two properties influences and limits individual behavior.<br/>
        <strong>Corollary:</strong> Pay attention to the need for structure and independence in each individual.<br/>
        <strong>Corollary:</strong> Put a structure in front of even the most independent-minded people, and they’ll
        internalize it.<br/> <strong>Corollary:</strong> People often behave the way they believe their <a
          href="https://en.wikipedia.org/wiki/The_Presentation_of_Self_in_Everyday_Life">role</a> requires them to (as
        opposed to the actual requirements of the role).<br/> <strong>Corollary:</strong> Pay attention to how people
        perceive their own roles, and break their expectations with caution.</p></>, <><p><a
      href="https://en.wikipedia.org/wiki/Social_status">Social status</a> – the observation (particularly in improv)
      that social status is so important to humans, that modeling status alone results in extremely realistic
      performances.<br/> <strong>Corollary:</strong> Pay attention to how people perceive their own status, and break
      their expectations with caution.<br/> <strong>See also:</strong> <a
        href="https://en.wikipedia.org/wiki/Self-serving_bias">Self-serving bias</a>.</p></>, <><p><strong>Controlled
      vulnerability:</strong> – the observation that humans are attracted to confidently expressed vulnerability in
      others but are scared to be vulnerable themselves.<br/> <strong>Corollary:</strong> Humans feel strong attraction
      towards others who confidently display vulnerability.<br/> <strong>Corollary:</strong> Humans feel a strong desire
      to <a href="https://en.wikipedia.org/wiki/Reciprocity_(social_psychology)">reciprocate</a> vulnerability.
      Vulnerability expression by others gives them a sense of safety to express themselves, followed by a feeling of
      relief and a strong bond with the counterpary.</p></> ],
    4: [ <><a href="https://en.wikipedia.org/wiki/Mere-exposure_effect">Mere-exposure effect</a> – an observation that
      humans tend to develop a preference for things, people, and processes merely because they are familiar with them.
      This effect is much stronger than it initially seems.<br/> <strong>Corollary:</strong> Merely putting people in a
      room together repeatedly, giving them a shared direction, symbology, and competition will create a group with very
      strong bonds.<br/> <strong>See also:</strong> <a href="https://en.wikipedia.org/wiki/In-group_favoritism">In-group
        favoritism</a>.</> ],
    5: [ <><p><a href="http://www.defmacro.org/2015/02/25/startup-ideas.html">Story arc</a> – human beings are wired
      to respond to storytelling. A story arc is a way to structure ideas to tap into this response, typically by
      describing a change in the world.<br/> <strong>Example:</strong> Once upon a time there was ___. Every day, ___.
      One day ___. Because of that, ___. Because of that, ___. Until finally ___.</p></>, <><p><a
      href="http://www.defmacro.org/2016/12/22/writing-well.html">Writing well</a> – use arresting imagery and
      tabulate your thoughts precisely. Never use a long word where a short one will do. If it’s possible to cut a
      word out, always cut it out. Don’t hedge – decide what you want to say and say it as vigorously as possible. Of
      all the places to go next, choose the most interesting.<br/></p></>, <><p><a
      href="https://en.wikipedia.org/wiki/Principle_of_charity">Charitable interpretation</a> – interpreting a
      speaker’s statements to be rational and, in the case of any argument, considering its best, strongest possible
      interpretation. Charitable interpretation makes conversations (and relationships) go better.</p></>, <><p><a
      href="https://en.wikipedia.org/wiki/Nonviolent_Communication">Nonviolent Communication</a> (aka NVC) – a
      communication framework that allows expressing grievances and resolving conflicts in a non-confrontational way.
      Structuring difficult conversations as described in NVC makes the process dramatically less painful. NVC
      contains four components: (1) expressing facts, (2) expressing feelings, (3) expressing needs, and (4) making a
      request.<br/> <strong>Example:</strong> You didn’t turn in the project yesterday. When that happened I felt
      betrayed. I need to be able to rely on you to have a productive relationship. In the future, could you notify me
      in advance if something like that happens?</p></> ],
    6: [ <><p><a href="https://en.wikipedia.org/wiki/Utilitarianism">Global utility maximization</a> – our innate
      sense of fairness is often unsatisfiable, and attemping to satisfy it can occasionally cause much grief in
      exchange for little gain. It’s much better to optimize for the needs of the many, not for an idealistic notion
      of fairness.<br/> <strong>Corollary:</strong> There are times when it makes sense to be unfair to the individual
      in the interest of the common good.<br/> <strong>Example:</strong> It makes sense to fire an underperforming
      employee who has valid excuses for their poor performance.<br/> <strong>Idiom:</strong> It is the greatest
      happiness of the greatest number that is the measure of right and wrong.<br/> <strong>See also:</strong> <a
        href="https://en.wikipedia.org/wiki/Preference_utilitarianism">Preference utilitarianism</a>.</p></>, <><p><a
      href="https://en.wikipedia.org/wiki/Tragedy_of_the_commons">Tragedy of the commons</a> – a set of circumstances
      where individuals acting independently in a reasonable manner behave contrary to the common good.<br/>
      <strong>Example:</strong> Tourists taking small artifacts from popular attractions.<br/>
      <strong>Corollary:</strong> Governance is necessary to preserve the common good.</p></>, <><p><strong>Front page
      test</strong> – an ethical standard for behavior that evaluates each action through the lens of the
      media/outside world.<br/> <strong>Example:</strong> What would happen if HN found out we’re mining our users’s
      IMs?<br/> <strong>Warning:</strong> Incentivizes extreme risk aversion, often without appropriate consideration
      for potential gain.</p></>, <><p><a href="http://www.cs.cmu.edu/~weigand/staff/">Reasonable person
      principle</a> – a rule of thumb for group communication originated in CMU. It holds that reasonable people
      strike a suitable balance between their own immediate desires and the good of the community at large.<br/>
      <strong>Corollary:</strong> Fire people that are offensive or easily offended. (It usually turns out that people
      who possess one of these qualities, possess both.)<br/> <strong>Note:</strong> unreasonable persons can be
      extremely valuable in greater society (e.g. journalists, comedians, whistleblowers, etc.), but usually not in
      small organizations.</p></>, <><p><a href="https://en.wikipedia.org/wiki/Overton_window">Overton window</a> –
      the range of ideas a particular group of people will accept. Ideas range in degree of acceptance from policy, to
      popular, sensible, acceptable, radical, and unthinkable.<br/> <strong>Corollary:</strong> you need to be
      sensitive to the overton window when presenting the group with cultural changes.<br/></p></>, <><p><a
      href="https://en.wikipedia.org/wiki/Political_capital">Political capital</a> – the trust and influence a leader
      wields with other people. Political capital increases when you make other people successful and decreases when
      you make unpopular decisions.<br/> <strong>Corollary:</strong> Spend political capital carefully.</p></> ]
  };

  renderDescription() {
    return null;
  }

  renderDetails() {
    const dow = new Date().getDay();
    const n = Math.floor(Date.now() / 60000) % this.hints[dow].length;  //new each 1 minute
    return <>
      <span className="hint-title">Hint of the day:</span><br/>
      {this.hints[dow][n]}<br/>
      <span className="hint-title">&nbsp;©&nbsp;<a href="https://www.defmacro.org/2016/12/22/models.html">Slava Akhmechet</a></span>
    </>;
  }
}

export default NullProvider;

