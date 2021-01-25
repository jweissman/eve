import chalk from 'chalk';


export function gardenAscii(): string {
  return `
                                           * . ~

                  - *

        * . ~                     .             *

        ${chalk.yellow('$')}

                  *              * - .

             *            ~                                . *

            .                                 ~*
                     ${chalk.white('eden')}         .

             o
                                .* .                  ${chalk.red('%')}

                         * -                  .

                                  * . ' 
          ~ . ~
`;
}
