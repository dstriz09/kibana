/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ExpressionFunction } from 'src/legacy/core_plugins/interpreter/public';
// @ts-ignore unconverted local lib
import { getState } from '../state/store';
import { getAssetById } from '../state/selectors/assets';
import { getFunctionHelp, getFunctionErrors } from '../../i18n';

interface Arguments {
  id: string;
}

export function asset(): ExpressionFunction<'asset', null, Arguments, string> {
  const { help, args: argHelp } = getFunctionHelp().asset;
  const errors = getFunctionErrors().asset;

  return {
    name: 'asset',
    aliases: [],
    type: 'string',
    help,
    context: {
      types: ['null'],
    },
    args: {
      id: {
        aliases: ['_'],
        types: ['string'],
        help: argHelp.id,
        required: true,
      },
    },
    fn: (_context, args) => {
      const assetId = args.id;
      const storedAsset = getAssetById(getState(), assetId);
      if (storedAsset !== undefined) {
        return storedAsset.value;
      }

      throw errors.invalidAssetId(assetId);
    },
  };
}
