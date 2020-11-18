import { RenderTest, jitSuite, test, preprocess, syntaxErrorFor } from '..';
import { KEYWORDS_TYPES, RESERVED_WORDS } from '@glimmer/compiler';

const KEYWORDS = Object.keys(KEYWORDS_TYPES);
const RESERVED = Object.keys(RESERVED_WORDS);

const BLOCK_KEYWORDS = KEYWORDS.filter((key) => KEYWORDS_TYPES[key].indexOf('Block') !== -1);

const APPEND_KEYWORDS = KEYWORDS.filter((key) => KEYWORDS_TYPES[key].indexOf('Append') !== -1);

const EXPR_KEYWORDS = KEYWORDS.filter((key) => KEYWORDS_TYPES[key].indexOf('Expr') !== -1);

const MODIFIER_KEYWORDS = KEYWORDS.filter((key) => KEYWORDS_TYPES[key].indexOf('Modifier') !== -1);

for (let keyword of KEYWORDS.concat(RESERVED)) {
  class KeywordSyntaxErrors extends RenderTest {
    static suiteName = `\`${keyword}\` keyword errors`;

    @test
    'keyword cannot be used as a value'() {
      let err = syntaxErrorFor(
        `\`${keyword}\` is a keyword or reserved word, and cannot be used as a variable name in a template. It was referenced as a this-less path variable`,
        keyword,
        'test-module',
        1,
        14
      );

      this.assert.throws(() => {
        preprocess(`{{some-helper ${keyword}}}`, { meta: { moduleName: 'test-module' } });
      }, err);
    }

    @test
    'keyword cannot be yielded as a parameter in other keywords'() {
      let err = syntaxErrorFor(
        `\`${keyword}\` is a keyword or reserved word, and cannot be used as a variable name in a template. It was used as a block parameter name`,
        `{{#let value as |${keyword}|}}`,
        'test-module',
        2,
        12
      );

      this.assert.throws(() => {
        preprocess(
          `
            {{#let value as |${keyword}|}}
              {{some-helper ${keyword}}}
            {{/let}}
          `,
          { meta: { moduleName: 'test-module' } }
        );
      }, err);
    }

    @test
    'keyword cannot be yielded as a parameter in curly invocation'() {
      let err = syntaxErrorFor(
        `\`${keyword}\` is a keyword or reserved word, and cannot be used as a variable name in a template. It was used as a block parameter name`,
        `{{#my-component value as |${keyword}|}}`,
        'test-module',
        2,
        12
      );

      this.assert.throws(() => {
        preprocess(
          `
            {{#my-component value as |${keyword}|}}
              {{some-helper ${keyword}}}
            {{/my-component}}
          `,
          { meta: { moduleName: 'test-module' } }
        );
      }, err);
    }

    @test
    'keyword cannot be yielded as a parameter in component blocks'() {
      let err = syntaxErrorFor(
        `\`${keyword}\` is a keyword or reserved word, and cannot be used as a variable name in a template. It was used as a block parameter name`,
        `<SomeComponent as |${keyword}|>`,
        'test-module',
        2,
        12
      );

      this.assert.throws(() => {
        preprocess(
          `
            <SomeComponent as |${keyword}|>
              {{some-helper ${keyword}}}
            </SomeComponent>
          `,
          { meta: { moduleName: 'test-module' } }
        );
      }, err);
    }

    @test
    'keyword cannot be yielded as a parameter in component named blocks'() {
      let err = syntaxErrorFor(
        `\`${keyword}\` is a keyword or reserved word, and cannot be used as a variable name in a template. It was used as a block parameter name`,
        `<:main as |${keyword}|>`,
        'test-module',
        3,
        14
      );

      this.assert.throws(() => {
        preprocess(
          `
            <SomeComponent>
              <:main as |${keyword}|>
                {{some-helper ${keyword}}}
              </:main>
            </SomeComponent>
          `,
          { meta: { moduleName: 'test-module' } }
        );
      }, err);
    }

    @test
    'non-block keywords cannot be used as blocks'() {
      if (BLOCK_KEYWORDS.indexOf(keyword) !== -1 || RESERVED.indexOf(keyword) !== -1) {
        return;
      }

      this.assert.throws(() => {
        preprocess(`{{#${keyword}}}{{/${keyword}}}`, { meta: { moduleName: 'test-module' } });
      }, new RegExp(`The \`${keyword}\` keyword was used incorrectly. It was used as a block statement, but its valid usages are:`));
    }

    @test
    'non-append keywords cannot be used as appends'() {
      if (APPEND_KEYWORDS.indexOf(keyword) !== -1 || RESERVED.indexOf(keyword) !== -1) {
        return;
      }

      this.assert.throws(() => {
        preprocess(`{{${keyword}}}`, { meta: { moduleName: 'test-module' } });
      }, new RegExp(`The \`${keyword}\` keyword was used incorrectly. It was used as an append statement, but its valid usages are:`));
    }

    @test
    'non-expr keywords cannot be used as expr'() {
      if (EXPR_KEYWORDS.indexOf(keyword) !== -1 || RESERVED.indexOf(keyword) !== -1) {
        return;
      }

      this.assert.throws(() => {
        preprocess(`{{some-helper (${keyword})}}`, { meta: { moduleName: 'test-module' } });
      }, new RegExp(`The \`${keyword}\` keyword was used incorrectly. It was used as an expression, but its valid usages are:`));
    }

    @test
    'non-modifier keywords cannot be used as modifier'() {
      if (MODIFIER_KEYWORDS.indexOf(keyword) !== -1 || RESERVED.indexOf(keyword) !== -1) {
        return;
      }

      this.assert.throws(() => {
        preprocess(`<div {{${keyword}}}></div>`, { meta: { moduleName: 'test-module' } });
      }, new RegExp(`The \`${keyword}\` keyword was used incorrectly. It was used as a modifier, but its valid usages are:`));
    }

    @test
    'reserved keywords give a helpful message'() {
      if (RESERVED.indexOf(keyword) === -1) {
        return;
      }

      this.assert.throws(() => {
        preprocess(`{{${keyword}}}`, { meta: { moduleName: 'test-module' } });
      }, new RegExp(`\`${keyword}\` is a reserved word, which is set aside for future use, but has not been implemented yet. Consider using the alternative version`));
    }
  }

  jitSuite(KeywordSyntaxErrors);
}
