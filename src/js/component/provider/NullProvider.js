import IProvider from "./IProvider";
import React from 'react';

class NullProvider extends IProvider {

  hints = [
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
  ];
  n_hint = Math.floor(Date.now() / 86400) % this.hints.length;

  renderDescription() {
    return null;
  }

  renderDetails() {
    return <>
      <span className="hint-title">Hint of the day:</span><br/>
      {this.hints[this.n_hint]}<br/>
      <span className="hint-title">&nbsp;©&nbsp;<a href="https://www.defmacro.org/2016/12/22/models.html">Slava Akhmechet</a></span>
    </>
    ;
  }
}

export default NullProvider;

