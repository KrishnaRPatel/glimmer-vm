import {
  CapturedArguments,
  ComponentDefinition,
  Dict,
  Maybe,
  Option,
  RuntimeResolver,
  Owner,
} from '@glimmer/interfaces';
import { createComputeRef, Reference, valueForRef } from '@glimmer/reference';
import {
  CurriedComponentDefinition,
  isCurriedComponentDefinition,
} from '../component/curried-component';
import { resolveComponent } from '../component/resolve';

export default function createCurryComponentRef(
  inner: Reference,
  resolver: RuntimeResolver,
  owner: Owner,
  args: Option<CapturedArguments>
) {
  let lastValue: Maybe<Dict>, lastDefinition: Option<CurriedComponentDefinition>;

  return createComputeRef(() => {
    let value = valueForRef(inner) as Maybe<Dict>;

    if (value === lastValue) {
      return lastDefinition;
    }

    let definition: Option<CurriedComponentDefinition | ComponentDefinition> = null;

    if (isCurriedComponentDefinition(value)) {
      definition = value;
    } else if (typeof value === 'string' && value) {
      definition = resolveComponent(resolver, value, owner);
    }

    definition = curry(definition, args);

    lastValue = value;
    lastDefinition = definition;

    return definition;
  });
}

function curry(
  definition: Option<CurriedComponentDefinition | ComponentDefinition>,
  args: Option<CapturedArguments>
): Option<CurriedComponentDefinition> {
  if (!args && isCurriedComponentDefinition(definition)) {
    return definition;
  } else if (!definition) {
    return null;
  } else {
    return new CurriedComponentDefinition(definition, args);
  }
}
