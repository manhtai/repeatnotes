import {useState, useEffect, useCallback} from 'react';
import * as API from 'src/libs/api';
import {SrsConfig, SyncStatus} from 'src/libs/types';
import debounce from 'lodash/debounce';
import logger from 'src/libs/logger';
import {useGlobal} from 'src/components/global/GlobalProvider';
import Loading from 'src/components/common/Loading';

export default function SrsConfigPage() {
  const [config, setConfig] = useState<SrsConfig>();
  const [learnSteps, setLearnSteps] = useState('');
  const [relearnSteps, setRelearnSteps] = useState('');
  const [loading, setLoading] = useState(false);

  const {setSync} = useGlobal();

  useEffect(() => {
    setLoading(true);
    API.fetchSrsConfig().then(
      (config) => {
        setLoading(false);
        setConfig(config);
        setLearnSteps(config.learn_steps.join(' '));
        setRelearnSteps(config.relearn_steps.join(' '));
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  const updateFunc = (srs_config: any) => {
    setSync(SyncStatus.Syncing);
    API.updateSrsConfig({srs_config}).then(
      () => {
        setSync(SyncStatus.Success);
      },
      (err) => {
        logger.error(err);
        setSync(SyncStatus.Error);
      }
    );
  };

  // eslint-disable-next-line
  const debounceUpdate = useCallback(debounce(updateFunc, 500), []);

  useEffect(() => {
    debounceUpdate(config);
  }, [debounceUpdate, config]);

  if (loading) {
    return <Loading />;
  }

  if (!config) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mb-16">
      <div className="mt-5">
        <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow-sm">
          Schedule
        </h2>
        <div className="p-4 pb-8 mb-5 bg-gray-100 rounded-b-lg shadow-sm">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-sm text-gray-700">
                Learn ahead time (minutes)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="20"
                value={config.learn_ahead_time}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.learn_ahead_time = !Number.isNaN(value) ? value : 20;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Maximum cards per session
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="20"
                value={config.maximum_per_session}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.maximum_per_session = !Number.isNaN(value)
                    ? value
                    : 20;
                  setConfig({...config});
                }}
              />
            </label>
            <div className="block">
              <div className="mt-2">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="text-indigo-600 border-gray-300 rounded shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      checked={false}
                      disabled
                    />
                    <span className="ml-2">Show next due in answer</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow-sm">
          Learn
        </h2>
        <div className="p-4 pb-8 mb-5 bg-gray-100 rounded-b-lg shadow-sm">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-sm text-gray-700">
                Learn steps (in minutes)
              </span>
              <input
                type="text"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="1 10"
                value={learnSteps}
                onChange={(e) => {
                  e.preventDefault();
                  setLearnSteps(e.target.value);
                  const learn_steps = e.target.value
                    .split(' ')
                    .map((s) => parseInt(s, 10))
                    .filter((n) => !Number.isNaN(n));

                  config.learn_steps = learn_steps;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Starting ease (%)</span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="250"
                value={config.initial_ease}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.initial_ease = !Number.isNaN(value) ? value : 2500;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Good graduating interval (days)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="1"
                value={config.graduating_interval_good}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.graduating_interval_good = !Number.isNaN(value)
                    ? value
                    : 1;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Easy graduating interval (days)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="4"
                value={config.graduating_interval_easy}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.graduating_interval_easy = !Number.isNaN(value)
                    ? value
                    : 4;
                  setConfig({...config});
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow-sm">
          Review
        </h2>
        <div className="p-4 pb-8 mb-5 bg-gray-100 rounded-b-lg shadow-sm">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-sm text-gray-700">Easy multiplier (%)</span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="130"
                value={config.easy_multiplier * 100}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10) / 100;
                  config.easy_multiplier = !Number.isNaN(value) ? value : 1.3;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Hard multiplier (%)</span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="120"
                value={config.hard_multiplier * 100}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10) / 100;
                  config.hard_multiplier = !Number.isNaN(value) ? value : 1.2;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Again multiplier (%)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="0"
                value={config.lapse_multiplier * 100}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10) / 100;
                  config.lapse_multiplier = !Number.isNaN(value) ? value : 0;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Interval multiplier (%)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="100"
                value={config.interval_multiplier * 100}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10) / 100;
                  config.interval_multiplier = !Number.isNaN(value) ? value : 1;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Maximum review interval (days)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="36500"
                value={config.maximum_review_interval}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.maximum_review_interval = !Number.isNaN(value)
                    ? value
                    : 36500;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Minium review interval (days)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="1"
                value={config.minimum_review_interval}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.minimum_review_interval = !Number.isNaN(value)
                    ? value
                    : 1;
                  setConfig({...config});
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow-sm">
          Relearn
        </h2>
        <div className="p-4 pb-8 mb-5 bg-gray-100 rounded-b-lg shadow-sm">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-sm text-gray-700">
                Relearn steps (in minutes)
              </span>
              <input
                type="text"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="10"
                value={relearnSteps}
                onChange={(e) => {
                  e.preventDefault();
                  setRelearnSteps(e.target.value);
                  const relearn_steps = e.target.value
                    .split(' ')
                    .map((s) => parseInt(s, 10))
                    .filter((n) => !Number.isNaN(n));

                  config.relearn_steps = relearn_steps;
                  setConfig({...config});
                }}
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                Leech threshold (times)
              </span>
              <input
                type="number"
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="8"
                value={config.leech_threshold}
                onChange={(e) => {
                  e.preventDefault();
                  const value = parseInt(e.target.value, 10);
                  config.leech_threshold = !Number.isNaN(value) ? value : 8;
                  setConfig({...config});
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
